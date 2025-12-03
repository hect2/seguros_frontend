import { useQuery } from "@tanstack/react-query";
import { getIncidentStatusAction } from "../actions/get-list-incident-status";

export const useIncidentStatusList = () => {
  const query = useQuery({
    queryKey: ["incidentStatusList"],
    queryFn: getIncidentStatusAction,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return query;
};
