import { api } from "@/api/api";
import { OfficesResponse } from "../interfaces/offices.response";

// Define a filter interface if you need specific filters for offices
interface OfficeFilters {
    page?: string;
    per_page?: string;
    sort_by?: string;
    sort_dir?: string;
    search?: string;
    status?: string;
    district_id?: string;
}

export const getOfficesAction = async (
    filters: OfficeFilters
): Promise<OfficesResponse> => {
    const { data } = await api.get<OfficesResponse>("/offices", {
        params: filters,
    });
    return data;
};
