import { api } from '@/api/api';
import { IncidentResponse } from '@/modules/incidents/interfaces/incidents.response';

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;

    criticality?: string[] | number[];
    dateFrom?: string;
    dateTo?: string;
    district?: string | number;
    type?: string | number;
    user?: string;
    office?: string | number;
}


export const getIncidentsAction = async (options: Options): Promise<IncidentResponse> => {

    const { page, per_page, sort_by, sort_dir, criticality, dateFrom, dateTo, district, type, user, office } = options;
    const { data } = await api.get<IncidentResponse>(`/incidents`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,

            search: user,
            type_id: type,
            district_id: district,
            criticidad: criticality,
            fecha_inicio: dateFrom,
            fecha_fin: dateTo,
            office_id: office,
        },
    });

    console.log('Incidents data:', data);

    return data;
}