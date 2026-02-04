import { api } from "@/api/api";
import { IncidentCatalog } from "../interfaces/incidents.catalog.interface";

interface IncidentCatalogStore {
    name:   string;
    type:   string;
    group:  string;
}

export const createIncidentCatalogAction = async (incidentCatalogLike: Partial<IncidentCatalog>) : Promise<IncidentCatalogStore> => {
    const { data } = await api<IncidentCatalogStore>({
        url: '/incidents/catalog',
        method: 'POST',
        data: incidentCatalogLike,
    });

    return data;
}