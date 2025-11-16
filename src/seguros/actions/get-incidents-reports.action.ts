import { api } from '@/api/api';
import { IncidentReports } from '@/interfaces/incidents-reports.response';

interface Options {
    start_date?: string;
    end_date?: string;
}


export const getIncidentsReportsAction = async (options: Options): Promise<IncidentReports> => {

    const { start_date, end_date } = options;
    const { data } = await api.get<IncidentReports>(`/incidents/reports`, {
        params: {
            start_date,
            end_date,
        },
    });

    console.log('Incidents Reports data:', data);

    return data;
}