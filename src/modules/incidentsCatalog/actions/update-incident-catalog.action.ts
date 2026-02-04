import { api } from "@/api/api";

interface IncidentCatalogStore {
    id:     number;
    name:   string;
    type:   string;
    group:  string;
    active ?: boolean;
}

export const updateIncidentCatalogAction = async (incidentCatalogLike: Partial<IncidentCatalogStore>) => {
  if (!incidentCatalogLike.id) {
    throw new Error("Incident Catalog ID is required for updating.");
  }
  const { id, ...dataToUpdate } = incidentCatalogLike;
  const { data } = await api<IncidentCatalogStore>({
          url: `/incidents/catalog/${id}`,
          method: 'PUT',
          data: dataToUpdate,
      });
  return data;
};
