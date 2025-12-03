import { api } from "@/api/api";
import { MessagesResponse } from "../interfaces/messages.response";

export const getIncidentFollowUpsAction = async (incidentId: number) : Promise<MessagesResponse> => {
  const { data } = await api.get(`/incidents/messages/list/${incidentId}`);
  return data;
};
