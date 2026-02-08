import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom";
import { IncidentFilters } from "@/modules/incidents/interfaces/incident-filters";
import { getServicePositionsAction } from "../actions/get-service-position.action";
import { ServicePositionResponses } from "../interfaces/service-positions.response";
import { createServicePositionAction } from "../actions/create-service-position.action";
import { updateServicePositionAction } from "../actions/update-sevice-positions.action";

export const useServicePosition = (filters: IncidentFilters = {}) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';
    const search = searchParams.get('search') || '';

    const query = useQuery<ServicePositionResponses>({
        queryKey: ['service-positions', { page, per_page, sort_by, sort_dir, search }],
        queryFn: () => getServicePositionsAction({
            page,
            per_page,
            sort_by,
            sort_dir, 
            search,
        })
    });

    const createServicePositionMutation = useMutation({
        mutationFn: createServicePositionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-positions'] });
        }
    });

    const updateServicePositionMutation = useMutation({
        mutationFn: updateServicePositionAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-positions'] });
        }
    });

    return {
        ...query,
        createServicePosition: createServicePositionMutation.mutateAsync,
        updateServicePosition: updateServicePositionMutation.mutateAsync,
    }
}