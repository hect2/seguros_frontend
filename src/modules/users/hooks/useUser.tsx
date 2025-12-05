import { useQuery } from "@tanstack/react-query"
import { getUserById } from "../actions/get-user-by-id.action";


export const useUser = (id: number) => {
    const query = useQuery({
        queryKey: ['user', {id}],
        queryFn: () => getUserById(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });

    return {
        ...query
    }
}