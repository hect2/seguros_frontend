import { useQuery } from "@tanstack/react-query";
import { getOfficeByIdAction } from "../actions/get-office-by-id.action";

export const useOffice = (id: number | null) => {
    const query = useQuery({
        queryKey: ["offices", id],
        queryFn: () => getOfficeByIdAction(id!),
        enabled: !!id, // Only run if the ID is not null
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return query;
};
