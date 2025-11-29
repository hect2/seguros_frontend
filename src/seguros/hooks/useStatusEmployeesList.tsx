import { StatusEmployeesListResponse } from "@/interfaces/status_employees.lists.response";
import { useQuery } from "@tanstack/react-query"
import { getStatusEmployeesListAction } from "../actions/get-list-status-employees";

export const useStatusEmployeesList = () => {

    return useQuery<StatusEmployeesListResponse>({
        queryKey: ['status_employees_list'],
        queryFn: () => getStatusEmployeesListAction()
    });
}