import { api } from '@/api/api';
import { IncidentCatalogListResponse } from '@/interfaces/incident-catalog.list.response';

export const getIncidentCatalogAction = async (): Promise<IncidentCatalogListResponse> => {

    const { data } = await api.get<IncidentCatalogListResponse>(`/list/incident-catalog`);

    console.log('Incident Catalog List data:', data);

    return data;
}