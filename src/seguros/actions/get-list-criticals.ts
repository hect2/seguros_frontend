import { api } from '@/api/api';
import { CriticalsListResponse } from '@/interfaces/criticals.lists.response';

export const getCriticalsListAction = async (): Promise<CriticalsListResponse> => {

    const { data } = await api.get<CriticalsListResponse>(`/list/criticals`);

    console.log('Criticals List data:', data);

    return data;
}