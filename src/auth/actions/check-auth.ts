import { api } from "@/api/api";
import { AuthResponse } from "../interfaces/auth.response";


export const checkAuthAction = async (): Promise<AuthResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    try {

        const { data } = await api.get<AuthResponse>('/user');
        console.log('data: ', data)
        localStorage.setItem('token', token);

        return data;
    } catch (error) {
        console.log(error);
        localStorage.removeItem('token');
        throw new Error('Token expired or not valid')
    }
}