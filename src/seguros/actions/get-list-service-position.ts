import { api } from '@/api/api';
import { ServicePositionListResponse } from '@/interfaces/service-positions.list.response';

export const getServicePositionAction = async (client_id?: number | string): Promise<ServicePositionListResponse> => {
    const params = client_id ? `${client_id}` : "";
    const { data } = await api.get<ServicePositionListResponse>(`/list/service-positions/${params}`);

    console.log('Service Position List data:', data);
    return data;
}