import { api } from "@/api/api";
import { IncidentsCatalogResponse } from "../interfaces/incidents.catalog.response";

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;
    search?: string;
}


export const getIncidentsCatalogsAction = async (options: Options): Promise<IncidentsCatalogResponse> => {
    const { page, per_page, sort_by, sort_dir, search } = options;
    const { data } = await api.get<IncidentsCatalogResponse>(`/incidents/catalog`, {
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