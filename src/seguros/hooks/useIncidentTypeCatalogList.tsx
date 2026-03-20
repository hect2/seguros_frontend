import { useQuery } from "@tanstack/react-query";
import { getIncidentTypeCatalogAction } from "../actions/get-list-incident-type-catalog";

export const useIncidentTypeCatalogList = () => {
  const query = useQuery({
    queryKey: ["incidentTypeCatalogList"],
    queryFn: getIncidentTypeCatalogAction,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return query;
};
