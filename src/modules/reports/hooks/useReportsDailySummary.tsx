import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsDailySummary = (filters: ReportFilters = {}, day: string) => {

    const type_summary = `${day}_summary`;
    const dailySummaryQuery = useQuery({
        queryKey: ['reports', type_summary, filters],
        queryFn: () => getReportAction(
            type_summary,
            filters,
        )
        // keepPreviousData: true,
    });

    return {
        ...dailySummaryQuery,
    };
};
