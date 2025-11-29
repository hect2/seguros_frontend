import { api } from "@/api/api";
import { DistrictsResponse } from "@/modules/districts/interfaces/districts.response";


export const getDistrictById= async(id: Number): Promise<DistrictsResponse> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<DistrictsResponse>(`/districts/${id}`);
    // console.log(`District: ${data}`)
    return data;
}