import { api } from "@/api/api";
import { StatusEmployee } from "../interfaces/status-employee.interface";
interface StatusStore {
    name:        string;
    description: string;
    slug:        string;
    category:    string;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}

export const createStatusEmployeeAction = async (statusLike: Partial<StatusEmployee>) : Promise<StatusStore> => {
    const { data } = await api<StatusStore>({
        url: '/employee-status',
        method: 'POST',
        data: statusLike,
    });

    return data;
}