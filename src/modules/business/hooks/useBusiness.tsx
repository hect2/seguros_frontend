import { getBusinessById } from "../actions/get-business-by-id.action";
import { useQuery } from "@tanstack/react-query"


export const useBusiness = (id: Number) => {
    const query = useQuery({
        queryKey: ['business', {id}],
        queryFn: () => getBusinessById(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });

    return {
        ...query
    }
}