import { useQuery } from "@tanstack/react-query"
import { PositionTypesListResponse } from "@/interfaces/position-types.lists.response";
import { getPositionTypesListAction } from "../actions/get-list-position-types";

export const usePositionTypesList = () => {

    return useQuery<PositionTypesListResponse>({
        queryKey: ['position_types_list'],
        queryFn: () => getPositionTypesListAction()
    });
}