import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getStatusemployeeTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/status-employees");
  return data.total;
};
