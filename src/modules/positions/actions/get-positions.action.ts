import { api } from "@/api/api";
import { PositionsResponse } from "../interfaces/positions.response";

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;
    search?: string;
}


export const getPositionsAction = async (options: Options): Promise<PositionsResponse> => {
    const { page, per_page, sort_by, sort_dir, search } = options;
    const { data } = await api.get<PositionsResponse>(`/position-types`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        },
    });

    console.log('Positions data:', data);

    return data;
}