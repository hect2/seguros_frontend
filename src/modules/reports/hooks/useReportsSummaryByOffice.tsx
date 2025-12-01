import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsSummaryByOffice = (filters: ReportFilters = {}) => {

    const resumenOficinaQuery = useQuery({
        queryKey: ['reports', 'summary_by_office', filters],
        // queryFn: () => fetchReport('summary_by_office'),
        queryFn: () => getReportAction(
            'summary_by_office',
            filters,
        )
        // keepPreviousData: true,
    });

    return {
        ...resumenOficinaQuery,
    };
};
