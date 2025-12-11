// src/modules/notifications/interfaces/notification.interface.ts
export interface BackendNotification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number | string;
  data: any;
  read_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  leida: boolean;
  titulo: string;
  descripcion?: string;
  timestamp: string;
  oficina?: string;
  distrito?: string;
  usuario?: string;
  criticidad?: string;
  criticidad_slug?: string;
  // raw para acceso a todo lo que venga del backend si lo necesitas
  raw?: BackendNotification;
}
