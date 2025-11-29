import { api } from '@/api/api';
import { RolesListResponse } from '@/interfaces/roles.lists.response';

export const getRolesListAction = async (): Promise<RolesListResponse> => {

    const { data } = await api.get<RolesListResponse>(`/list/roles`);

    console.log('Roles List data:', data);

    return data;
}