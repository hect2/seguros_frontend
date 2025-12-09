import { useQuery } from '@tanstack/react-query';
import { getGlobalDistributionByRegionAction } from '../actions/get-global-distribution-by-region.action';

export const useGlobalDistributionByRegion = () => {

    const globalDistributionByRegionQuery = useQuery({
        queryKey: ['global_distribution_by_region'],
        queryFn: () => getGlobalDistributionByRegionAction(),
        retry: 1,
    });
    return {
        ...globalDistributionByRegionQuery,
    };
};
