import { api } from "@/api/api";
import { StatusEmployee } from "../interfaces/status-employee.interface";
import { StatusEmployeesResponse } from "../interfaces/status-employees.response";

interface Options {
    page?: number | string;
    per_page?: number | string;
    sort_by?: string;
    sort_dir?: string;
    search?: string;
}

export const getStatusEmployeesAction = async (options: Options): Promise<StatusEmployeesResponse> => {
    const { page, per_page, sort_by, sort_dir, search } = options;
    const { data } = await api.get<StatusEmployeesResponse>(`/employee-status`, {
        params: {
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        },
    });

    console.log('Positions data:', data);

    return data;
}