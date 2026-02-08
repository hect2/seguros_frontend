import { useQuery } from "@tanstack/react-query";
import { getServicePositionAction } from "../actions/get-list-service-position";

export const useServicePositionsList = (id?: number | string) => {
  const query = useQuery({
    queryKey: ["incidentCatalogList", id],
    queryFn: () =>
      getServicePositionAction(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return query;
};
