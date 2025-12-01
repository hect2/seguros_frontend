import { api } from "@/api/api";
import { Business } from "@/modules/business/interfaces/business.interface";
import { BusinessResponse } from "../interfaces/business-response";


export const getBusinessById= async(id: Number): Promise<BusinessResponse> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<BusinessResponse>(`/business/show/${id}`);
    console.log(`Business: ${data}`)
    return data;
}