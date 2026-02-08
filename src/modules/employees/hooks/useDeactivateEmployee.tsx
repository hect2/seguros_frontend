import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deactivateEmployee } from "../actions/deactivate-employee.action";

export const useDeactivateEmployee = (userId: number) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deactivateEmployee(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employee", { id: userId }],
      });

      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Usuario dado de baja correctamente");
    },

    onError: () => {
      toast.error("Error al dar de baja");
    },
  });

  return {
    deactivate: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
