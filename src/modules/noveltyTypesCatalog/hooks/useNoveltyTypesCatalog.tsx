import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom";
import { NoveltyTypesCatalogResponse } from "../interfaces/novelty.types.catalog.response";
import { getNoveltyTypesCatalogsAction } from "../actions/get-novelty-types-catalog.action";
import { createNoveltyTypesCatalogAction } from "../actions/create-novelty-types-catalog.action";
import { updateNoveltyTypesCatalogAction } from "../actions/update-novelty-types-catalog.action";

export const useNoveltyTypesCatalog = () => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';
    const search = searchParams.get('search') || '';

    const query = useQuery<NoveltyTypesCatalogResponse>({
        queryKey: ['novelty-types-catalog', { page, per_page, sort_by, sort_dir, search }],
        queryFn: () => getNoveltyTypesCatalogsAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            search,
        })
    });

    const createNoveltyTypesCatalogMutation = useMutation({
        mutationFn: createNoveltyTypesCatalogAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['novelty-types-catalog'] });
        }
    });

    const updateNoveltyTypesCatalogMutation = useMutation({
        mutationFn: updateNoveltyTypesCatalogAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['novelty-types-catalog'] });
        }
    });

    return {
        ...query,
        createNoveltyTypesCatalog: createNoveltyTypesCatalogMutation.mutateAsync,
        updateNoveltyTypesCatalog: updateNoveltyTypesCatalogMutation.mutateAsync,
    }
}
