import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployeesAction } from "../actions/get-employees.action";
import { EmployeeFilters } from "../interfaces/employee-filters";
import { useSearchParams } from "react-router-dom";
import { EmployeesResponse } from "../interfaces/employees.response";
import { createEmployee } from "../actions/create-employee.action";
import { CreateEmployeeDto } from "../interfaces/create-employee.dto";
import { updateEmployee } from "../actions/updateEmployee.action";

export const useEmployees = (filters: EmployeeFilters) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page') || '1';
  const per_page = searchParams.get('per_page') || '10';
  const sort_by = searchParams.get('sort_by') || 'id';
  const sort_dir = searchParams.get('sort_dir') || 'desc';

  console.log('useEmployees:', filters)

  const query = useQuery<EmployeesResponse>({
    queryKey: ['employees', { page, per_page, sort_by, sort_dir, ...filters, }],
    queryFn: () => getEmployeesAction({
      page,
      per_page,
      sort_by,
      sort_dir,
      ...filters,
    })
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (employeeData: CreateEmployeeDto) => createEmployee(employeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      // Aquí podrías añadir una notificación de éxito
    },
    onError: (error) => {
      // Aquí podrías añadir una notificación de error
      console.error("Error creating employee:", error);
    },
  });


  const updateEmployeeMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateEmployeeDto;
    }) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  return {
    ...query,
    createEmployee: createEmployeeMutation.mutate,
    updateEmployee: updateEmployeeMutation.mutate,
  };
};
