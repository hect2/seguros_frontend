// src/modules/notifications/actions/get-notifications.action.ts
import { api } from '@/api/api';
import { BackendNotification } from '../interfaces/notification.interface';

interface Options {
  severity?: string; // 'Alta', 'Media', 'Baja' (opcional)
}

const mapBackendToUI = (n: BackendNotification): Notification => {
  const d = n.data || {};

  return {
    id: n.id,
    leida: !!n.read_at,
    titulo: d.title || d.titulo || d.incident_title || 'Notificación',
    descripcion: d.description || d.descripcion || d.message || '',
    timestamp: n.created_at,
    oficina: d.office || d.oficina || '',
    distrito: (d.district_name || d.distrito || d.district_id) ?? '',
    usuario: d.created_by_name || d.usuario || '',
    criticidad: d.criticidad || d.criticidad_level || d.severity || '',
    raw: n,
  };
};

export const getNotificationsAction = async (options?: Options): Promise<Notification[]> => {
  const params: any = {};
  if (options?.severity) params.severity = options.severity;

  const { data } = await api.get<BackendNotification[]>('/notifications');

  // Backend returns array of notifications from Laravel DB (notifications table)
  return (data || []).map(mapBackendToUI);
};
