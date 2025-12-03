import { api } from "@/api/api";
import { Office } from "../interfaces/office.interface";

export const getOfficeByIdAction = async (id: number): Promise<Office> => {
    if (!id) throw new Error("Id is required");

    const { data } = await api.get<{data: Office}>(`/offices/${id}`);
    return data.data;
};
