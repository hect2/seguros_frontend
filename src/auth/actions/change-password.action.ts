import { api } from "@/api/api";

export const changePasswordAction = async (userId: number, currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<boolean> => {
    try {
        await api.put(`/users/${userId}/change-password`, { 
            current_password: currentPassword, 
            new_password: newPassword, 
            new_password_confirmation: newPasswordConfirmation,
        });
        return true;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al cambiar la contraseña');
    }
}
