import { api } from '@/api/api';
import { PositionTypesListResponse } from '@/interfaces/position-types.lists.response';

export const getPositionTypesListAction = async (): Promise<PositionTypesListResponse> => {

    const { data } = await api.get<PositionTypesListResponse>(`/list/positiontypes`);

    console.log('Position Types List data:', data);

    return data;
}