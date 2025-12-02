import { api } from "@/api/api";
import { Office } from '@/modules/offices/interfaces/office.interface';

export const createOfficeAction = async (
  officeData: Office
): Promise<Office> => {
  const { data } = await api.post<Office>("/offices", officeData);
  return data;
};
