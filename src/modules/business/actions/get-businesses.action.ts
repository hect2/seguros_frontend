import { api } from '@/api/api';
import { BusinessesResponse } from '@/modules/business/interfaces/businesses.response';
import { Search } from 'lucide-react';

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;

    search?: string;
    status?: string;
}


export const getBusinessesAction = async (options: Options): Promise<BusinessesResponse> => {

    const { page, per_page, sort_by, sort_dir, search, status } = options;
    const { data } = await api.get<BusinessesResponse>(`/business`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,
            
            search,
            status,
        },
    });

    console.log('Businesses data:', data);

    return data;
}