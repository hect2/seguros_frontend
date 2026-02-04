import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IncidentResponse } from "@/modules/incidents/interfaces/incidents.response";
import { useSearchParams } from "react-router-dom";
import { IncidentFilters } from "@/modules/incidents/interfaces/incident-filters";
import { Incident } from "@/modules/incidents/interfaces/incident";
import { IncidentStore } from "@/modules/incidents/interfaces/incident-store";
import { getIncidentsAction } from "../../incidents/actions/get-incidents.action";
import { creatIncidentAction } from "../../incidents/actions/create-incident.action";
import { IncidentsCatalogResponse } from "../interfaces/incidents.catalog.response";
import { getIncidentsCatalogsAction } from "../actions/get-incident-catalog.action";
import { createIncidentCatalogAction } from "../actions/create-incident-catalog.action";
import { updateIncidentCatalogAction } from "../actions/update-incident-catalog.action";

export const useIncidentsCatalog = (filters: IncidentFilters = {}) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';
    const search = searchParams.get('search') || '';

    const query = useQuery<IncidentsCatalogResponse>({
        queryKey: ['incidents-catalog', { page, per_page, sort_by, sort_dir, search }],
        queryFn: () => getIncidentsCatalogsAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        })
    });

    const createIncidentCatalogMutation = useMutation({
        mutationFn: createIncidentCatalogAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents-catalog'] });
        }
    });

    const updateIncidentCatalogMutation = useMutation({
        mutationFn: updateIncidentCatalogAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incidents-catalog'] });
        }
    });

    return {
        ...query,
        createIncidentCatalog: createIncidentCatalogMutation.mutateAsync,
        updateIncidentCatalog: updateIncidentCatalogMutation.mutateAsync,
    }
}