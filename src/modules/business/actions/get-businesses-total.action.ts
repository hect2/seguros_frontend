import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getBusinessesTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/business");
  return data.total;
};
