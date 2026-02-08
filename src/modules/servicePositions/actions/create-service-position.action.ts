import { api } from "@/api/api";

interface ServicePositionStore {
    business_id:  number;
    name:         string;
    location:     string;
    shift:        string;
    service_type: string;
}


export const createServicePositionAction = async (servicePositionLike: Partial<ServicePositionStore>) : Promise<ServicePositionStore> => {
    const { data } = await api<ServicePositionStore>({
        url: '/service-positions',
        method: 'POST',
        data: servicePositionLike,
    });

    return data;
}