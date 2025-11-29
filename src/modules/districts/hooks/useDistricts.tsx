import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DistrictsResponse } from "@/modules/districts/interfaces/districts.response";
import { useSearchParams } from "react-router-dom";
import { DistrictStore } from "@/modules/districts/interfaces/district-store";
import { getDistrictsAction } from "../actions/get-districts.action";
import { creatDistrictAction } from "@/modules/districts/actions/create-district.action";

export const useDistricts = () => {
    const queryClient = useQueryClient();
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    const query = useQuery<DistrictsResponse>({
        queryKey: ['districts', { page, per_page, sort_by, sort_dir }],
        queryFn: () => getDistrictsAction({
            page,
            per_page,
            sort_by,
            sort_dir,
        })
    });

    const mutation = useMutation({
        mutationFn: creatDistrictAction,
        onSuccess: (district: DistrictStore) => {
            queryClient.invalidateQueries({ queryKey: ['districts'] });
            console.log('District created successfully:', district);
        }
    })

    return {
        ...query,
        mutation,
    }
}