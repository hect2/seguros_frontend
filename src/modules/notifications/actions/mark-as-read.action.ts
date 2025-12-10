// src/modules/notifications/actions/mark-as-read.action.ts
import { api } from '@/api/api';

export const markNotificationReadAction = async (id: string): Promise<void> => {
  await api.post(`/notifications/${id}/read`);
};
