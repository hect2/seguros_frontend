import { useQuery } from '@tanstack/react-query';
import { getReportAction, ReportFilters } from '../actions/get-report.action';

export const useReportsDigessp = (filters: ReportFilters = {}) => {

    const digesspQuery = useQuery({
        queryKey: ['reports', 'digessp_certifications', filters],
        // queryFn: () => fetchReport('digessp_certifications'),
        queryFn: () => getReportAction(
            'digessp_certifications',
            filters,
        )
        // keepPreviousData: true,
    });
    return {
        ...digesspQuery,
    };
};
