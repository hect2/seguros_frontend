import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { BusinessesResponse } from "@/modules/business/interfaces/businesses.response";
import { useSearchParams } from "react-router-dom";
import { BusinessStore } from "@/modules/business/interfaces/business-store";
import { getBusinessesAction } from "../actions/get-businesses.action";
import { createBusinessAction } from "@/modules/business/actions/create-business.action";

export const useBusinesses = () => {
    const queryClient = useQueryClient();
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    const query = useQuery<BusinessesResponse>({
        queryKey: ['businesses', { page, per_page, sort_by, sort_dir }],
        queryFn: () => getBusinessesAction({
            page,
            per_page,
            sort_by,
            sort_dir,
        })
    });

    const mutation = useMutation({
        mutationFn: createBusinessAction,
        onSuccess: (business: BusinessStore) => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] });
            console.log('Business created successfully:', business);
        }
    })

    return {
        ...query,
        mutation,
    }
}