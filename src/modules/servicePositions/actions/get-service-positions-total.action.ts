import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getServicePositionTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/service-positions");
  return data.total;
};
