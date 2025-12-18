import { api } from "@/api/api";

interface StatusStore {
    name:        string;
    description: string;
    slug:        string;
    category:    string;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}

export const updateStatusEmployeeAction = async (statusLike: Partial<StatusStore>) => {
  if (!statusLike.id) {
    throw new Error("Status ID is required for updating.");
  }
  const { id, ...dataToUpdate } = statusLike;

  const { data } = await api<StatusStore>({
          url: `/employee-status/${id}`,
          method: 'PUT',
          data: dataToUpdate,
      });
  return data;
};
