import { api } from "@/api/api";

export const updateIncidentAssigneeAction = async ({
  incidentId,
  userId,
}: {
  incidentId: number;
  userId: number;
}) => {
  const { data } = await api.put(`/incidents/assign/${incidentId}`, {
    user_assigned: userId,
  });
  return data;
};
