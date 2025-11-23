import { api } from "@/api/api"
import { AuthResponse } from "../interfaces/auth.response";

export const loginAction = async (email: string, password: string) : Promise<AuthResponse> => {
    try {
        const { data } = await api.post<AuthResponse>('/login', {
            email,
            password,
        });

        console.log(data);

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}