import { api } from '@/api/api';
import { OfficesListResponse } from '@/interfaces/offices.lists.response';

export const getOfficesListAction = async (): Promise<OfficesListResponse> => {

    const { data } = await api.get<OfficesListResponse>(`/list/offices`);

    console.log('Offices List data:', data);

    return data;
}