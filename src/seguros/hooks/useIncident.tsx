import { useQuery } from "@tanstack/react-query"
import { getIncidentById } from "../actions/get-incident-by-id.action"


export const useIncident = (id: Number) => {
    const query = useQuery({
        queryKey: ['incident', {id}],
        queryFn: () => getIncidentById(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });

    return {
        ...query
    }
}