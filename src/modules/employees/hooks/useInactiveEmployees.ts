import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';

interface UseInactiveEmployeesParams {
  search?: string;
  per_page?: number;
  page?: number;
}

export const useInactiveEmployees = (params: UseInactiveEmployeesParams = {}) => {
  return useQuery({
    queryKey: ['inactive_employees', params],
    queryFn: async () => {
      const { data } = await api.get('/employees/inactive', { params });
      return data;
    },
  });
};
