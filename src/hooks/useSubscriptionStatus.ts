import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SubscriptionStatusResponse } from "@/types/subscription";

/**
 * GET /student/status — Retorna o status de assinatura/acesso do usuário.
 * Inclui access_type, datas de expiração e dados do plano atual.
 * Cacheado por 2 minutos para balancear frescor vs. performance.
 */
export function useSubscriptionStatus(options?: { enabled?: boolean }) {
  return useQuery<SubscriptionStatusResponse>({
    queryKey: ["subscription-status"],
    queryFn: () => api.get<SubscriptionStatusResponse>("student/status"),
    staleTime: 2 * 60 * 1000, // 2 minutos
    ...options,
  });
}
