import { api } from "@/api/api";
import { UserStore } from "../interfaces/user-store";
import { User } from "../interfaces/user.response";

export const updateUserAction = async (userLike: Partial<User>): Promise<UserStore> => {
    // if (!userLike.id) {
    //     throw new Error("User ID is required to update user");
    // }
    console.log('Updating user with data:', userLike.id);
    const { ...rest } = userLike;
    // const body = { ...rest };

    const { data } = await api<UserStore>({
        url: `/users/${userLike.id}`,
        method: 'PUT',
        data: rest,
    });
    
    data.id = Number(userLike.id);

    return data;
};
