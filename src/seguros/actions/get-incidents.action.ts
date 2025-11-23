import { api } from '@/api/api';
import { IncidentResponse } from '@/interfaces/incidents.response';

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;

    criticality?: string[] | number[];
    dateFrom?: string;
    dateTo?: string;
    office?: string | number;
    type?: string | number;
    user?: string;
}


export const getIncidentsAction = async (options: Options): Promise<IncidentResponse> => {

    const { page, per_page, sort_by, sort_dir, criticality, dateFrom, dateTo, office, type, user } = options;
    const { data } = await api.get<IncidentResponse>(`/incidents`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,

            search: user,
            type_id: type,
            office_id: office,
            criticidad: criticality,
            fecha_inicio: dateFrom,
            fecha_fin:dateTo,
        },
    });

    console.log('Incidents data:', data);

    return data;
}