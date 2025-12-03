import { api } from '@/api/api';
import { IncidentStatusListResponse } from '@/interfaces/incident-status.list.response';

export const getIncidentStatusAction = async (): Promise<IncidentStatusListResponse> => {

    const { data } = await api.get<IncidentStatusListResponse>(`/list/incident-status`);

    console.log('Incident Status List data:', data);

    return data;
}