import { getIncidentById } from "@/modules/incidents/actions/get-incident-by-id.action";
import { useQuery } from "@tanstack/react-query"


export const useDistrict = (id: Number) => {
    const query = useQuery({
        queryKey: ['district', {id}],
        queryFn: () => getIncidentById(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });

    return {
        ...query
    }
}