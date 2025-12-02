import { useQuery } from '@tanstack/react-query';
import { getDistributionByRegionAction } from '../actions/get-distribution-by-region.action';

export const useDistributionByRegion = () => {

    const distributionByRegionQuery = useQuery({
        queryKey: ['distribution_by_region'],
        queryFn: () => getDistributionByRegionAction()
    });

    return {
        ...distributionByRegionQuery,
    };
};
