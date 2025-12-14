import { useQuery } from "@tanstack/react-query";
import { getEmployeeHistoryAction } from "../actions/get-employee-history.action";

export const useEmployeeHistory = (employee_id: number | null, enabled: boolean) => {
  return useQuery({
    queryKey: ["employee-history", employee_id],
    queryFn: () => getEmployeeHistoryAction(employee_id!),
    enabled: enabled && !!employee_id,
    staleTime: 1000 * 60 * 2,
  });
};
