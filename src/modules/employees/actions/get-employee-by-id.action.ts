import { api } from "@/api/api";
import { EmployeeResponse } from "../interfaces/employee-response";

export const getEmployeeById= async(id: number): Promise<EmployeeResponse> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<EmployeeResponse>(`/employees/show/${id}`);
    console.log(`Employee: ${data}`)
    return data;
}