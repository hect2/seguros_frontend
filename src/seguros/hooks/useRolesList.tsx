import { RolesListResponse } from "@/interfaces/roles.lists.response";
import { useQuery } from "@tanstack/react-query"
import { getRolesListAction } from "../actions/get-list-roles";

export const useRolesList = () => {

    return useQuery<RolesListResponse>({
        queryKey: ['roles_list'],
        queryFn: () => getRolesListAction()
    });
}