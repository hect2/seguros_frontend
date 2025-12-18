import { api } from "@/api/api";

interface PositionStore {
    name:        string;
    description: string;
    slug:        string;
    category:    string;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}

export const updatePositionAction = async (positionLike: Partial<PositionStore>) => {
  if (!positionLike.id) {
    throw new Error("Position ID is required for updating.");
  }
  const { id, ...dataToUpdate } = positionLike;

  const { data } = await api<PositionStore>({
          url: `/position-types/${id}`,
          method: 'PUT',
          data: dataToUpdate,
      });
  return data;
};
