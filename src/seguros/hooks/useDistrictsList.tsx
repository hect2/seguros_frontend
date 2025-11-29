import { DistrictsListResponse } from "@/interfaces/districts.lists.response";
import { useQuery } from "@tanstack/react-query"
import { getDistrictsListAction } from "../actions/get-list-districts";

export const useDistrictsList = () => {

    return useQuery<DistrictsListResponse>({
        queryKey: ['districts_list'],
        queryFn: () => getDistrictsListAction()
    });
}