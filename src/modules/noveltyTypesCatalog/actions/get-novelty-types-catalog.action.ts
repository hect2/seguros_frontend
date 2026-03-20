import { api } from "@/api/api";
import { NoveltyTypesCatalogResponse } from "../interfaces/novelty.types.catalog.response";

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;
    search?: string;
}

export const getNoveltyTypesCatalogsAction = async (options: Options): Promise<NoveltyTypesCatalogResponse> => {
    const { page, per_page, sort_by, sort_dir, search } = options;
    const { data } = await api.get<NoveltyTypesCatalogResponse>(`/incidents/types`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        },
    });

    return data;
}
