import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { useQuery } from "@tanstack/react-query"
import { getDistrictsListAction } from "../actions/get-list-districts";

interface Filters{ 
    user_id?: number;
}

export const useDistrictsList = (filters :Filters) => {

    const user_id = Number(filters.user_id) || 0;

    return useQuery<DistrictsListResponse>({
        queryKey: ['districts_list', {user_id}],
        queryFn: () => getDistrictsListAction({
            user_id,
        })
    });
}