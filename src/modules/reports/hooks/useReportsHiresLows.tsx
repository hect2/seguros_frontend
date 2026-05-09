import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsHiresLows = (filters: ReportFilters = {}) => {

    const hiresLowsQuery = useQuery({
        queryKey: ['reports', 'hires_lows_summary', filters],
        queryFn: () => getReportAction(
            'hires_lows_summary',
            filters,
        )
    });

    return {
        ...hiresLowsQuery,
    };
};
