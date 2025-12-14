import { api } from "@/api/api";

export interface EmployeeBackup {
  id: number;
  employee_id: number;
  data: any;
  created_at: string;
}

export const getEmployeeHistoryAction = async (employee_id: number): Promise<EmployeeBackup[]> => {
  if (!employee_id) throw new Error("Employee_id is required");

  const { data } = await api.get<{ data: EmployeeBackup[] }>(
    `/employees/history/${employee_id}`
  );

  return data.data;
};
