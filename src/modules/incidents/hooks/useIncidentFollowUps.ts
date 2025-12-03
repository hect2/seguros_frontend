import { useQuery } from "@tanstack/react-query";
import { getIncidentFollowUpsAction } from "../actions/get-incident-follow-ups.action";
import { MessagesResponse } from "../interfaces/messages.response";

export const useIncidentFollowUps = (incidentId: number) => {
  const query = useQuery<MessagesResponse>({
    queryKey: ["incidents", incidentId, "follow-ups"],
    queryFn: () => getIncidentFollowUpsAction(incidentId),
    enabled: !!incidentId, // Only run the query if incidentId is available
  });

  return query;
};
