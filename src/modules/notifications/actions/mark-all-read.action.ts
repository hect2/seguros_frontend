// src/modules/notifications/actions/mark-all-read.action.ts
import { api } from '@/api/api';

export const markAllNotificationsReadAction = async (): Promise<void> => {
  await api.post(`/notifications/read-all`);
};
