import { api } from '@/api/api';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';


export const getDistrictsListAction = async (): Promise<DistrictsListResponse> => {

    const { data } = await api.get<DistrictsListResponse>(`/list/districts`);

    console.log('Districts List data:', data);

    return data;
}