import { api } from '@/api/api';
import { IncidentTypeCatalogListResponse } from '@/interfaces/incident-type-catalog.list.response';

export const getIncidentTypeCatalogAction = async (): Promise<IncidentTypeCatalogListResponse> => {
    const { data } = await api.get<IncidentTypeCatalogListResponse>(`/list/incident-type-catalogs`);
    return data;
}
