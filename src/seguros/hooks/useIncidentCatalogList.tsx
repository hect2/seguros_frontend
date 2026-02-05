import { useQuery } from "@tanstack/react-query";
import { getIncidentCatalogAction } from "../actions/get-list-incident-catalog";

export const useIncidentCatalogList = () => {
  const query = useQuery({
    queryKey: ["incidentCatalogList"],
    queryFn: getIncidentCatalogAction,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return query;
};
