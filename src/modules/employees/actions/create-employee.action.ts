import { api } from "../../../api/api";
import { Employee } from "../interfaces/employee.interface";
import { CreateEmployeeDto } from "../interfaces/create-employee.dto";

export const createEmployee = async (employeeData: CreateEmployeeDto) => {
  const { data } = await api.post<Employee>("/employees", employeeData);
  return data;
};
