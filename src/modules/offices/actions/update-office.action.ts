import { api } from "@/api/api";
import { Office } from "../interfaces/office.interface";

export const updateOfficeAction = async (
  officeData: Partial<Office>
): Promise<Office> => {
  if (!officeData.id) {
    throw new Error("Office ID is required for updating.");
  }
  const { id, ...dataToUpdate } = officeData;
  const { data } = await api.put<Office>(`/offices/${id}`, dataToUpdate);
  return data;
};
