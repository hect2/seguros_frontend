import { api } from "@/api/api";
import { Position } from "../interfaces/position.interface";

interface PositionStore {
    name:        string;
    description: string;
    slug:        string;
    category:    string;
    updated_at:  Date;
    created_at:  Date;
    id:          number;
}


export const createPositionAction = async (positionLike: Partial<Position>) : Promise<PositionStore> => {
    const { data } = await api<PositionStore>({
        url: '/position-types',
        method: 'POST',
        data: positionLike,
    });

    return data;
}