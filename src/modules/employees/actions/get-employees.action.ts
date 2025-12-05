import { api } from "../../../api/api";
import { EmployeesResponse } from "../interfaces/employees.response";

interface Options {
  page?: number | string;
  per_page?: number | string;
  sort_by?: string;
  sort_dir?: string;

  search?: string;
  office_id?: number;
  district_id?: number;
  status_id?: number;
}


export const getEmployeesAction = async (options: Options): Promise<EmployeesResponse> => {
  const { page, per_page, sort_by, sort_dir, search, office_id, district_id, status_id } = options;
  const { data } = await api.get<EmployeesResponse>(`/employees`, {
    params: {
      page,
      per_page,
      sort_by,
      sort_dir,

      search,
      office_id,
      district_id,
      status_id,
    },
  });

  console.log('Employees data:', data);

  return data;
};
