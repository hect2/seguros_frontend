// src/modules/notifications/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotificationsAction } from '../actions/get-notifications.action';
import { markNotificationReadAction } from '../actions/mark-as-read.action';
import { markAllNotificationsReadAction } from '../actions/mark-all-read.action';
import { Notification } from '../interfaces/notification.interface';

export const useNotifications = (severity?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery<Notification[]>({
        queryKey: ['notifications', { severity }],
        queryFn: () => getNotificationsAction({ severity }),
        // si quieres también puedes usar websocket en vez de polling
        refetchInterval: 15000, // polling 15s, opcional
        staleTime: 1000 * 10,
    });

    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => markNotificationReadAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: () => markAllNotificationsReadAction(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    // helper demo: simular notificación localmente (no persistente)
    const simulateNewNotification = () => {
        const fake: Notification = {
            id: Math.random().toString(36).substring(2),
            leida: false,
            titulo: 'Incidente demo',
            descripcion: 'Incidente simulado (demo)',
            timestamp: new Date().toISOString(),
            oficina: 'Oficina Demo',
            distrito: 'Distrito Demo',
            usuario: 'Sistema',
            criticidad: severity || 'Alta',
            raw: undefined,
        };

        const current = queryClient.getQueryData<Notification[]>(['notifications', { severity }]) || [];
        queryClient.setQueryData(['notifications', { severity }], [fake, ...current]);
    };

    return {
        ...query,
        notifications: query.data || [],
        unreadCount: (query.data || []).filter(n => !n.leida).length,
        markAsRead: (id: string) => markAsReadMutation.mutateAsync(id),
        markAllAsRead: () => markAllAsReadMutation.mutateAsync(),
        simulateNewNotification,
    };
};
