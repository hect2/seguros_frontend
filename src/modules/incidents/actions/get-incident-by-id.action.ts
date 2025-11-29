import { api } from "@/api/api";
import { IncidentResponse } from "@/modules/incidents/interfaces/incidents.response";


export const getIncidentById= async(id: Number): Promise<IncidentResponse> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<IncidentResponse>(`/incidents/show/${id}`);
    // console.log(`Inciden: ${data}`)
    return data;
}