 import { api } from "@/api/api";
import { DistrictResponse } from "../interfaces/district.response";


export const getDistrictById= async(id: number): Promise<DistrictResponse> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<DistrictResponse>(`/districts/${id}`);
    // console.log(`District: ${data}`)
    return data;
}