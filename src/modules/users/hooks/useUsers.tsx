import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom";
import { UserFilters } from "../interfaces/user-filters";
import { UsersResponse } from "../interfaces/users.response";
import { getUsersAction } from "../actions/get-users.action";
import { createUserAction } from "../actions/create-user.action";
import { UserStore } from "../interfaces/user-store";
import { User as UserUpdate } from '../interfaces/user.response';
import { updateUserAction } from "../actions/update-user.action";

export const useUsers = (filters: UserFilters = {}) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') || '1';
    const per_page = searchParams.get('per_page') || '10';
    const sort_by = searchParams.get('sort_by') || 'id';
    const sort_dir = searchParams.get('sort_dir') || 'desc';

    console.log('useUsers:', filters)

    const query = useQuery<UsersResponse>({
        queryKey: ['users', { page, per_page, sort_by, sort_dir, ...filters, }],
        queryFn: () => getUsersAction({
            page,
            per_page,
            sort_by,
            sort_dir,
            ...filters,
        })
    });

    const mutation = useMutation({
        mutationFn: createUserAction,
        onSuccess: (user: UserStore) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            console.log('User created successfully:', user);
        },
        onError: (error: Error) => {
            console.error(error.message);
        },
    })

    const updateMutation = useMutation({
        mutationFn: updateUserAction,
        onSuccess: (user: UserStore) => {
            // Invalida el listado de usuarios
            queryClient.invalidateQueries({ queryKey: ['users'] });

            // Invalida datos individuales si los usás en detalle
            queryClient.invalidateQueries({ queryKey: ['user', { id: user.id }] });

            console.log('User updated successfully:', user);
        },

        onError: (error: Error) => {
            console.error("Update error:", error.message);
        }
    });

    return {
        ...query,
        mutation,
        updateMutation,
    }
}