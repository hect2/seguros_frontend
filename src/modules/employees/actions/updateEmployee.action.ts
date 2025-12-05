import { api } from "../../../api/api";
import { Employee } from "../interfaces/employee.interface";
import { CreateEmployeeDto } from "../interfaces/create-employee.dto";

export const updateEmployee = async (id: number, employeeData: CreateEmployeeDto) => {
  const { data } = await api.put<Employee>(`/employees/update/${id}`, employeeData);
  return data;
};
