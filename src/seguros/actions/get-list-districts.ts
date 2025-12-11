import { api } from '@/api/api';
import { DistrictsListResponse } from '@/interfaces/districts.lists.response';

interface Options{ 
    user_id?: number;
}

export const getDistrictsListAction = async (options: Options): Promise<DistrictsListResponse> => {
    const { user_id, } = options;

    const { data } = await api.get<DistrictsListResponse>(`/list/districts`, {
        params: {
            user_id,
        }
    });

    console.log('Districts List data:', data);

    return data;
}