import { useQuery } from "@tanstack/react-query"
import { CriticalsListResponse } from "@/interfaces/criticals.lists.response";
import { getCriticalsListAction } from "../actions/get-list-criticals";

export const useCriticalsList = () => {

    return useQuery<CriticalsListResponse>({
        queryKey: ['criticals_list'],
        queryFn: () => getCriticalsListAction()
    });
}