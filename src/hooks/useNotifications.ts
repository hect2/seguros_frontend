import { useState, useCallback } from 'react';
export interface Notification {
  id: string;
  titulo: string;
  oficina: string;
  distrito: string;
  usuario: string;
  criticidad: 'Alta' | 'Media' | 'Baja';
  timestamp: string;
  leida: boolean;
  tipo?: string;
  descripcion?: string;
  estado?: string;
}
const mockNotificationsAlta: Notification[] = [{
  id: 'NOV-2025-00231',
  titulo: 'Incidente en OTR Escuintla',
  oficina: 'OTR ESCUINTLA',
  distrito: 'DICE',
  usuario: 'Pedro Ramírez',
  criticidad: 'Alta',
  timestamp: '2025-10-20T10:25:00Z',
  leida: false,
  tipo: 'Novedades Negativas',
  descripcion: 'Incidente crítico reportado en la oficina de Escuintla',
  estado: 'En Seguimiento'
}, {
  id: 'NOV-2025-00218',
  titulo: 'Suspensión médica IGSS',
  oficina: 'OTR PETÉN',
  distrito: 'DINOR',
  usuario: 'María García',
  criticidad: 'Alta',
  timestamp: '2025-10-20T09:10:00Z',
  leida: false,
  tipo: 'Permisos',
  descripcion: 'Suspensión médica urgente requiere atención',
  estado: 'En Seguimiento'
}, {
  id: 'NOV-2025-00205',
  titulo: 'Falta injustificada',
  oficina: 'AREA NORTE',
  distrito: 'DICE',
  usuario: 'Juan Pérez',
  criticidad: 'Alta',
  timestamp: '2025-10-19T14:30:00Z',
  leida: false,
  tipo: 'Faltando',
  descripcion: 'Ausencia sin justificación en turno crítico',
  estado: 'Pendiente'
}];
export function useNotifications(severity?: 'Alta' | 'Media' | 'Baja') {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotificationsAlta);
  const filteredNotifications = severity ? notifications.filter(n => n.criticidad === severity) : notifications;
  const unreadCount = filteredNotifications.filter(n => !n.leida).length;
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? {
      ...n,
      leida: true
    } : n));
  }, []);
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({
      ...n,
      leida: true
    })));
  }, []);
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  }, []);
  const simulateNewNotification = useCallback(() => {
    const newNotification: Notification = {
      id: `NOV-2025-${Math.floor(Math.random() * 1000).toString().padStart(5, '0')}`,
      titulo: 'Nueva notificación de prueba',
      oficina: 'OTR SALAMÁ',
      distrito: 'DINOC',
      usuario: 'Ana Martínez',
      criticidad: 'Alta',
      timestamp: new Date().toISOString(),
      leida: false,
      tipo: 'Importantes',
      descripcion: 'Notificación de prueba generada automáticamente',
      estado: 'Pendiente'
    };
    addNotification(newNotification);
  }, [addNotification]);
  return {
    notifications: filteredNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    simulateNewNotification
  };
}