import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getOfficesAction } from "../actions/get-offices.action";
import { createOfficeAction } from "../actions/create-office.action";
import { updateOfficeAction } from "../actions/update-office.action";
import { deleteOfficeAction } from "../actions/delete-office.action";

interface OfficeFilters {
    search?: string;
    status?: string;
    district_id?: string;
}

export const useOffices = (filters: OfficeFilters = {}) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "10";
    const sort_by = searchParams.get("sort_by") || "id";
    const sort_dir = searchParams.get("sort_dir") || "desc";

    const query = useQuery({
        queryKey: ["offices", { page, per_page, sort_by, sort_dir, ...filters }],
        queryFn: () =>
            getOfficesAction({
                page,
                per_page,
                sort_by,
                sort_dir,
                ...filters,
            }),
    });

    const createOfficeMutation = useMutation({
        mutationFn: createOfficeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offices"] });
            queryClient.invalidateQueries({ queryKey: ["district"] });
        },
    });

    const updateOfficeMutation = useMutation({
        mutationFn: updateOfficeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offices"] });
            queryClient.invalidateQueries({ queryKey: ["district"] });
        },
    });

    const deleteOfficeMutation = useMutation({
        mutationFn: deleteOfficeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offices"] });
        },
    });

    return {
        ...query,
        createOffice: createOfficeMutation.mutateAsync,
        updateOffice: updateOfficeMutation.mutateAsync,
        deleteOffice: deleteOfficeMutation.mutateAsync,
    };
};
