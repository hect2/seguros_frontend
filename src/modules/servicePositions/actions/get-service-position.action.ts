import { api } from "@/api/api";
import { ServicePositionResponses } from "../interfaces/service-positions.response";

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;
    search?: string;
    client_id?: string;
}


export const getServicePositionsAction = async (options: Options): Promise<ServicePositionResponses> => {
    const { page, per_page, sort_by, sort_dir, search, client_id } = options;
    const { data } = await api.get<ServicePositionResponses>(`/service-positions`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
            client_id,
        },
    });

    console.log('Service Positions data:', data);

    return data;
}