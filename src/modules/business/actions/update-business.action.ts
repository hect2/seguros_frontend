import { api } from "@/api/api";
import { Business } from "../interfaces/business.interface";

export const updateBusinessAction = async (businessData: Partial<Business>) => {
  if (!businessData.id) {
    throw new Error("Business ID is required for updating.");
  }
  const { id, ...dataToUpdate } = businessData;

  const { data } = await api<Business>({
          url: `/business/${id}`,
          method: 'PUT',
          data: dataToUpdate,
      });
  return data;
};
