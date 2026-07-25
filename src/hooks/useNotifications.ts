// hooks/useNotifications.ts — Hooks para o sistema de notificações
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Notification,
  PaginatedNotifications,
  UnreadCountResponse,
} from "@/types/notification";

/** Contexto de rollback para atualizações otimistas */
interface OptimisticContext {
  previousNotifications: PaginatedNotifications | undefined;
  previousCount: UnreadCountResponse | undefined;
}

// ── Query Keys ──────────────────────────────────────────────────────
const NOTIFICATIONS_KEY = ["notifications"] as const;
const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;

/** Intervalo de polling em milissegundos (60 segundos) */
const POLL_INTERVAL_MS = 60_000;

// ── Queries ─────────────────────────────────────────────────────────

/**
 * Busca a lista de notificações do usuário autenticado.
 * Faz polling a cada 60s e revalida ao focar na janela.
 */
export function useNotifications() {
  return useQuery<PaginatedNotifications>({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () => api.get<PaginatedNotifications>("notifications"),
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}

/**
 * Busca a contagem de notificações não lidas.
 * Polling independente para manter o badge do sino sempre atualizado.
 */
export function useUnreadCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: () => api.get<UnreadCountResponse>("notifications/unread-count"),
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}

// ── Mutations ───────────────────────────────────────────────────────

/**
 * Marca uma notificação individual como lida.
 * Atualiza o cache local otimisticamente para UX instantânea.
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string, OptimisticContext>({
    mutationFn: (notificationId: string) =>
      api.post<void>(`notifications/${notificationId}/mark-as-read`, {}),

    onMutate: async (notificationId) => {
      // Cancela queries em andamento para evitar overwrites
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_KEY });

      // Snapshot para rollback
      const previousNotifications =
        queryClient.getQueryData<PaginatedNotifications>(NOTIFICATIONS_KEY);
      const previousCount =
        queryClient.getQueryData<UnreadCountResponse>(UNREAD_COUNT_KEY);

      // Atualização otimista: marca read_at localmente
      queryClient.setQueryData<PaginatedNotifications>(
        NOTIFICATIONS_KEY,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((n) =>
              n.id === notificationId
                ? { ...n, read_at: new Date().toISOString() }
                : n,
            ),
          };
        },
      );

      // Decrementa o contador
      queryClient.setQueryData<UnreadCountResponse>(UNREAD_COUNT_KEY, (old) => {
        if (!old) return old;
        return {
          unread_count: Math.max(0, old.unread_count - 1),
        };
      });

      return { previousNotifications, previousCount };
    },

    onError: (_err, _id, context) => {
      // Rollback em caso de erro
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_KEY,
          context.previousNotifications,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(UNREAD_COUNT_KEY, context.previousCount);
      }
    },

    onSettled: () => {
      // Revalida para garantir consistência com o servidor
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}

/**
 * Marca todas as notificações como lidas.
 * Atualiza todo o cache local otimisticamente.
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void, OptimisticContext>({
    mutationFn: () => api.post<void>("notifications/mark-all-as-read", {}),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      await queryClient.cancelQueries({ queryKey: UNREAD_COUNT_KEY });

      const previousNotifications =
        queryClient.getQueryData<PaginatedNotifications>(NOTIFICATIONS_KEY);
      const previousCount =
        queryClient.getQueryData<UnreadCountResponse>(UNREAD_COUNT_KEY);

      // Marca todas como lidas localmente
      const now = new Date().toISOString();
      queryClient.setQueryData<PaginatedNotifications>(
        NOTIFICATIONS_KEY,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((n) => ({
              ...n,
              read_at: n.read_at ?? now,
            })),
          };
        },
      );

      // Zera o contador
      queryClient.setQueryData<UnreadCountResponse>(UNREAD_COUNT_KEY, {
        unread_count: 0,
      });

      return { previousNotifications, previousCount };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          NOTIFICATIONS_KEY,
          context.previousNotifications,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(UNREAD_COUNT_KEY, context.previousCount);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
      queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
    },
  });
}
