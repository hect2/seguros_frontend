import { api } from "@/api/api";

export const deleteOfficeAction = async (id: number): Promise<void> => {
  await api.delete(`/offices/${id}`);
};
