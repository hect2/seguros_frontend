import { api } from "@/api/api";

export const scheduleIncidentFollowUpAction = async ({
  incidentId,
  date,
}: {
  incidentId: number;
  date: string;
}) => {
  const { data } = await api.put(`/incidents/follow/${incidentId}`, {
    follow_date: date,
  });
  return data;
};
