import { getDistrictById } from "../actions/get-district-by-id.action";
import { useQuery } from "@tanstack/react-query"


export const useDistrict = (id: number) => {
    const query = useQuery({
        queryKey: ['district', {id}],
        queryFn: () => getDistrictById(id),
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
        enabled: !!id,
    });

    return {
        ...query
    }
}