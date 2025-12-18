import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PositionsResponse } from "@/modules/positions/interfaces/positions.response";
import { useSearchParams } from "react-router-dom";
import { getPositionsAction } from "../actions/get-positions.action";
import { createPositionAction } from "@/modules/positions/actions/create-position.action";
import { updatePositionAction } from "@/modules/positions/actions/update-position.action";

export const usePositions = () => {
    const queryClient = useQueryClient();
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';
    const search = searchParams.get('search') || '';

    const query = useQuery<PositionsResponse>({
        queryKey: ['positions', { page, per_page, sort_by, sort_dir, search }],
        queryFn: () => getPositionsAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        })
    });

    const createPositionMutation = useMutation({
        mutationFn: createPositionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
        }
    });

    const updatePositionMutation = useMutation({
        mutationFn: updatePositionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
        }
    });

    return {
        ...query,
        createPosition: createPositionMutation.mutateAsync,
        updatePosition: updatePositionMutation.mutateAsync,
    }
}
