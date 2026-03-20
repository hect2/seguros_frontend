import { api } from "@/api/api";
import { NoveltyTypesCatalog } from "../interfaces/novelty.types.catalog.interface";

export const createNoveltyTypesCatalogAction = async (catalog: Partial<NoveltyTypesCatalog>) => {
    const { data } = await api.post(`/incidents/types`, catalog);
    return data;
}
