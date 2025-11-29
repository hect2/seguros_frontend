import { api } from "@/api/api";
import { UserStore } from "../interfaces/user-store";
import { User } from "../interfaces/user";


export const createUserAction = async (userLike: Partial<User>) : Promise<UserStore> => {
    const {
        ...rest
    } = userLike

    const { data } = await api<UserStore>({
        url: '/users',
        method: 'POST',
        data: rest,
    });

    return data;
}