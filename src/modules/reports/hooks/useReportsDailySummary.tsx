import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsDailySummary = (code?: string) => {
    
    const filters: ReportFilters = {
        code,
    };
    const type_summary = `all_summary`;

    const dailySummaryQuery = useQuery({
        queryKey: ['reports', type_summary, filters],
        queryFn: () => getReportAction(
            type_summary,
            filters,
        ),
        // keepPreviousData: true,
        enabled: !!code,
    });

    return {
        ...dailySummaryQuery,
    };
};
