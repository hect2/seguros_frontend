import { useQuery } from "@tanstack/react-query";
import { getEmployeeById } from "../actions/get-employee-by-id.action";

export const useEmployee = (id: number) => {
  const query = useQuery({
    queryKey: ["employee", { id }],
    queryFn: () => getEmployeeById(id),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!id,
  });

  return {
    ...query,
  }
};