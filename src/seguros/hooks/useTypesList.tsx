import { useQuery } from "@tanstack/react-query"
import { TypesListResponse } from "@/interfaces/types.lists.response";
import { geTypesListAction } from "../actions/get-list-types";

export const useTypesList = () => {

    return useQuery<TypesListResponse>({
        queryKey: ['types_list'],
        queryFn: () => geTypesListAction()
    });
}