import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getIncidentsAction } from "../actions/get-incidents.action";
import { IncidentResponse } from "@/interfaces/incidents.response";
import { useSearchParams } from "react-router-dom";
import { IncidentFilters } from "@/interfaces/incident-filters";
import { Incident } from "@/interfaces/incident";
import { creatIncidentAction } from "../actions/create-incident.action";
import { IncidentStore } from "@/interfaces/incident-store";

export const useIncidents = (filters : IncidentFilters = {} ) => {
    const queryClient = useQueryClient();
    const [ searchParams ] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    console.log('useIncidents:', filters)
    
    const query =  useQuery<IncidentResponse>({
        queryKey: ['incidents', { page, per_page, sort_by, sort_dir, ...filters, }],
        queryFn: () => getIncidentsAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            ...filters,
        })
    });

    const mutation = useMutation({
        mutationFn: creatIncidentAction,
        onSuccess: (incident: IncidentStore) => {
            queryClient.invalidateQueries({ queryKey: ['incidents'] });
            console.log('Incident created successfully:', incident);
        }
    })

    
//   const handleSubmitForm = async (incidentLike: Partial<Incident>) => {
//     console.log('incidentLike : ', incidentLike);
//   }


    return {
        ...query,
        mutation,
    }
}