import { api } from "@/api/api";
import { NoveltyTypesCatalog } from "../interfaces/novelty.types.catalog.interface";

export const updateNoveltyTypesCatalogAction = async (catalog: Partial<NoveltyTypesCatalog>) => {
    const { id, ...rest } = catalog;
    const { data } = await api.put(`/incidents/types/${id}`, rest);
    return data;
}
