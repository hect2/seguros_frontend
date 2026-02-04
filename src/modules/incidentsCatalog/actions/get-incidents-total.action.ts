import { api } from "../../../api/api";

interface Response {
  total: number;
}

export const getIncidentsCatalogTotal = async (): Promise<number> => {
  const { data } = await api.get<Response>("/counts/incidents");
  return data.total;
};
