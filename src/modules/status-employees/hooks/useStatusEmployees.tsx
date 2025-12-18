import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { StatusEmployeesResponse } from "@/modules/status-employees/interfaces/status-employees.response";
import { useSearchParams } from "react-router-dom";
import { getStatusEmployeesAction } from "../actions/get-status-employees.action";
import { createStatusEmployeeAction } from "@/modules/status-employees/actions/create-status-employee.action";
import { updateStatusEmployeeAction } from "@/modules/status-employees/actions/update-status-employee.action";
import { StatusEmployeeFilters } from "../interfaces/status-employee-filters";

export const useStatusEmployees = (filters : StatusEmployeeFilters = {} ) => {
    const queryClient = useQueryClient();
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';
    const search = searchParams.get('search') || '';

    const query = useQuery<StatusEmployeesResponse>({
        queryKey: ['status-employees', { page, per_page, sort_by, sort_dir, search }],
        queryFn: () => getStatusEmployeesAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        })
    });

    const createStatusEmployeeMutation = useMutation({
        mutationFn: createStatusEmployeeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['status-employees'] });
        }
    });

    const updateStatusEmployeeMutation = useMutation({
        mutationFn: updateStatusEmployeeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['status-employees'] });
        }
    });

    return {
        ...query,
        createStatusEmployee: createStatusEmployeeMutation.mutateAsync,
        updateStatusEmployee: updateStatusEmployeeMutation.mutateAsync,
    }
}
