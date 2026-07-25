"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/useNotifications";
import type { Notification } from "@/types/notification";

// ── Subcomponente: Item de Notificação ──────────────────────────────
interface NotificationItemProps {
  notification: Notification;
  onSelect: (notification: Notification) => void;
}

function NotificationItem({ notification, onSelect }: NotificationItemProps) {
  const isUnread = notification.read_at === null;
  console.log(notification);
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <button
      type="button"
      onClick={() => onSelect(notification)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
        "hover:bg-accent/20 focus-visible:outline-none focus-visible:bg-accent/20",
        "border-b border-border/50 last:border-b-0",
        isUnread && "bg-accent/10",
      )}
    >
      {/* Indicador de não lida */}
      <div className="mt-1.5 flex-shrink-0">
        {isUnread ? (
          <span className="block h-2 w-2 rounded-full bg-blue-500" />
        ) : (
          <Check className="h-3.5 w-3.5 text-muted-foreground/40" />
        )}
      </div>

      {/* Conteúdo */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={cn(
            "text-sm leading-tight",
            isUnread
              ? "font-semibold text-foreground"
              : "font-medium text-muted-foreground",
          )}
        >
          {notification.data.title}
        </p>
        <p className="text-xs leading-snug text-muted-foreground line-clamp-2">
          {notification.data.message}
        </p>
        <p className="text-[11px] text-muted-foreground/60">{timeAgo}</p>
      </div>
    </button>
  );
}

// ── Subcomponente: Loading Skeleton ─────────────────────────────────
function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <Skeleton className="mt-1.5 h-2 w-2 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-2.5 w-1/4" />
      </div>
    </div>
  );
}

// ── Subcomponente: Estado Vazio ─────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Inbox className="mb-3 h-10 w-10 text-muted-foreground/30" />
      <p className="text-sm font-medium text-muted-foreground">
        Nenhuma notificação
      </p>
      <p className="text-xs text-muted-foreground/60">
        Você será notificado sobre atualizações importantes aqui.
      </p>
    </div>
  );
}

// ── Componente Principal ────────────────────────────────────────────
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: notifications, isLoading } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = unreadData?.unread_count ?? 0;
  const items = notifications?.data ?? [];
  const handleSelect = useCallback(
    (notification: Notification) => {
      // Se não lida, marca como lida silenciosamente
      if (notification.read_at === null) {
        markAsRead.mutate(notification.id);
      }

      // Fecha o popover
      setOpen(false);

      // Redireciona se houver action_url
      if (notification.data.action_url) {
        router.push(notification.data.action_url);
      }
    },
    [markAsRead, router],
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead.mutate();
  }, [markAllAsRead]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label={
            unreadCount > 0
              ? `Notificações — ${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
              : "Notificações"
          }
        >
          <Bell size={18} />

          {/* Badge de contagem */}
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 flex items-center justify-center",
                "min-w-[18px] h-[18px] rounded-full px-1",
                "bg-red-500 text-[10px] font-bold text-white",
                "ring-2 ring-card",
                "animate-in zoom-in-50 duration-200",
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            Notificações
          </h3>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Lista de Notificações */}
        <ScrollArea className="max-h-[380px]">
          {isLoading ? (
            <div>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onSelect={handleSelect}
              />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
