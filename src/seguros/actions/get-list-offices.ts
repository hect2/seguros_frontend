import { api } from '@/api/api';
import { OfficesListResponse } from '@/interfaces/offices.lists.response';

interface Options {
    district_id?: number;
    user_id?: number;
}

export const getOfficesListAction = async (options: Options): Promise<OfficesListResponse> => {

    const { district_id, user_id, } = options;

    const { data } = await api.get<OfficesListResponse>(`/list/offices`, {
        params: {
            district_id,
            user_id,
        }
    });

    console.log('Offices List data:', data);

    return data;
}