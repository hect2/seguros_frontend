import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BusinessesResponse } from "@/modules/business/interfaces/businesses.response";
import { useSearchParams } from "react-router-dom";
import { getBusinessesAction } from "../actions/get-businesses.action";
import { createBusinessAction } from "@/modules/business/actions/create-business.action";
import { updateBusinessAction } from "@/modules/business/actions/update-business.action";
import { BusinessFilters } from "../interfaces/business-filters";
import { Business } from "../interfaces/business.interface";

export const useBusinesses = (filters : BusinessFilters = {} ) => {
    const queryClient = useQueryClient();
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    console.log('useBusinesses:', filters)

    const query = useQuery<BusinessesResponse>({
        queryKey: ['businesses', { page, per_page, sort_by, sort_dir, ...filters }],
        queryFn: () => getBusinessesAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            ...filters,
        })
    });

    const createBusinessMutation = useMutation({
        mutationFn: createBusinessAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
        }
    });

    const updateBusinessMutation = useMutation({
        mutationFn: updateBusinessAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            queryClient.invalidateQueries({ queryKey: ['business'] });
        }
    });

    return {
        ...query,
        createBusiness: createBusinessMutation.mutateAsync,
        updateBusiness: updateBusinessMutation.mutateAsync,
    }
}