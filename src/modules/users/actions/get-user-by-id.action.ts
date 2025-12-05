import { api } from "@/api/api";
import { UserResponse } from "../interfaces/user.response";


export const getUserById= async(id: number): Promise<UserResponse> => {
    if (!id) throw new Error('Id is required');


    const { data } = await api.get<UserResponse>(`/users/${id}`);

    console.log("User:", data);
    
    return data;
}