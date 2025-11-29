import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getDistrictsTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/districts");
  return data.total;
};
