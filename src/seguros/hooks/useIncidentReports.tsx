import { useQuery } from "@tanstack/react-query"
import { getIncidentsReportsAction } from "../actions/get-incidents-reports.action";
import { IncidentReports } from "@/interfaces/incidents-reports.response";
import { useSearchParams } from "react-router-dom";

export const useIncidentReports = () => {
    const [ searchParams ] = useSearchParams();

    // Fechas por defecto (primer y último día del mes actual)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    // Obtener fechas desde los params o usar defaults
    const start_date = searchParams.get('start_date') || startOfMonth;
    const end_date = searchParams.get('end_date') || endOfMonth;

    return useQuery<IncidentReports>({
        queryKey: ['incidents_reports', { start_date, end_date }],
        queryFn: () => getIncidentsReportsAction({
            start_date,
            end_date,
        })
    });
}