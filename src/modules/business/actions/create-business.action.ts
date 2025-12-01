import { api } from "@/api/api";
import { BusinessStore } from "@/modules/business/interfaces/business-store";
import { Business } from "@/modules/business/interfaces/business.interface";

export const createBusinessAction = async (businessLike: Partial<Business>) : Promise<BusinessStore> => {
    const {
        id,
        created_at,
        updated_at,
        ...rest
    } = businessLike

    const { data } = await api<BusinessStore>({
        url: '/business',
        method: 'POST',
        data: rest,
    });

    return data;
}