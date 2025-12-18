import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getPositionsTypesTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/positions-types");
  return data.total;
};
