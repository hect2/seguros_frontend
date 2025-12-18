import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsDailySummary = (filters: ReportFilters = {}) => {

    const dailySummaryQuery = useQuery({
        queryKey: ['reports', 'daily_summary', filters],
        queryFn: () => getReportAction(
            'daily_summary',
            filters,
        )
        // keepPreviousData: true,
    });

    return {
        ...dailySummaryQuery,
    };
};
