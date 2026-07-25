// types/notification.ts — Tipagens para o sistema de notificações Laravel

/**
 * Representa uma notificação individual vinda do backend.
 * Formato baseado no padrão de DatabaseNotification do Laravel.
 */
export interface Notification {
  /** UUID da notificação (gerado pelo Laravel) */
  id: string;
  /** Tipo da notificação (ex: "App\\Notifications\\NewCourseAvailable") */
  type: string;
  data: {
    message: string;
    title: string;
    action_url: string;
    course_id: number;
  };
  /** Título exibido ao usuário */
  /** URL para redirecionamento ao clicar (pode ser nula) */
  /** Data/hora de leitura — null se não lida */
  read_at: string | null;
  /** Data/hora de criação (ISO 8601) */
  created_at: string;
}

/**
 * Resposta paginada do Laravel para listagem de notificações.
 */
export interface PaginatedNotifications {
  data: Notification[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * Resposta do endpoint de contagem de não lidas.
 */
export interface UnreadCountResponse {
  unread_count: number;
}
