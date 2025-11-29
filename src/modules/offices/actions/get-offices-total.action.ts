import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getOfficesTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/offices");
  return data.total;
};
