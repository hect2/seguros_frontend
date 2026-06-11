import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';

export const useReactivateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/employees/reactivate/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inactive_employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};
