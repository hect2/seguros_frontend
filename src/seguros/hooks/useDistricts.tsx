import { useQuery } from "@tanstack/react-query"
import { getDistrictsAction } from "../actions/get-districts.action";
import { DistrictsResponse } from "@/interfaces/districts.response";
import { useSearchParams } from "react-router-dom";

export const useDistricts = () => {
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    return useQuery<DistrictsResponse>({
        queryKey: ['districts', { page, per_page, sort_by, sort_dir }],
        queryFn: () => getDistrictsAction({
            page,
            per_page,
            sort_by,
            sort_dir,
        })
    });
}