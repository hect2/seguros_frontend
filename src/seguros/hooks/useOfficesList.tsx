import { useQuery } from "@tanstack/react-query"
import { OfficesListResponse } from "@/interfaces/offices.lists.response";
import { getOfficesListAction } from "../actions/get-list-offices";

interface Filters{ 
    district_id?: number;
    user_id?: number;
}

export const useOfficesList = (filters :Filters) => {
    const district_id = Number(filters.district_id) || 0;
    const user_id = Number(filters.user_id) || 0;

    return useQuery<OfficesListResponse>({
        queryKey: ['offices_list', {district_id, user_id}],
        queryFn: () => getOfficesListAction({
            district_id,
            user_id,
        })
    });
}