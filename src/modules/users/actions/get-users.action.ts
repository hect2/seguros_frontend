import { api } from '@/api/api';
import { UsersResponse } from '../interfaces/users.response';

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;

    search?: string;
    status?: string | number;
    district_ids?: string[];
    rol_id?: string | number;
}


export const getUsersAction = async (options: Options): Promise<UsersResponse> => {

    const { page, per_page, sort_by, sort_dir, search, status, district_ids, rol_id } = options;
    const { data } = await api.get<UsersResponse>(`/users`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,

            search,
            status,
            district_ids,
            rol_id,
        },
    });

    console.log('Users data:', data);

    return data;
}