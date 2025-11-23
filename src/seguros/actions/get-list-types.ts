import { api } from '@/api/api';
import { TypesListResponse } from '@/interfaces/types.lists.response';

export const geTypesListAction = async (): Promise<TypesListResponse> => {

    const { data } = await api.get<TypesListResponse>(`/list/types`);

    console.log('Types List data:', data);

    return data;
}