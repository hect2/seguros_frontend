import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsTotalsClient = (filters: ReportFilters = {}) => {
    const totalesClienteQuery = useQuery({
        queryKey: ['reports', 'totals_by_client', filters],
        // queryFn: () => fetchReport('totals_by_client'),
        queryFn: () => getReportAction(
            'totals_by_client',
            filters,
        )
        // keepPreviousData: true,
    });

    return {
        ...totalesClienteQuery,
    };
};
