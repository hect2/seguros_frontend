import { api } from "@/api/api";
import { Business } from "@/modules/business/interfaces/business.interface";


export const getBusinessById= async(id: Number): Promise<Business> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<Business>(`/businesses/${id}`);
    // console.log(`Business: ${data}`)
    return data;
}