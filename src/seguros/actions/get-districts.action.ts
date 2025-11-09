import { api } from '@/api/api';
import { DistrictsResponse } from '@/interfaces/districts.response';

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;
}


export const getDistrictsAction = async (options: Options): Promise<DistrictsResponse> => {

    const { page, per_page, sort_by, sort_dir } = options;
    const { data } = await api.get<DistrictsResponse>(`/districts`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,
        },
    });

    console.log('Districts data:', data);

    return data;
}