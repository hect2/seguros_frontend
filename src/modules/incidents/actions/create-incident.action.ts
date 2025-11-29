import { api } from "@/api/api";
import { Incident } from "@/modules/incidents/interfaces/incident";
import { IncidentStore } from "@/modules/incidents/interfaces/incident-store";


export const creatIncidentAction = async (incidentLike: Partial<Incident>) : Promise<IncidentStore> => {
    const {
        criticity_slug,
        ...rest
    } = incidentLike

    rest.user_assigned = null;
    rest.files = [];

    const { data } = await api<IncidentStore>({
        url: '/incidents',
        method: 'POST',
        data: rest,
    });

    return data;
}