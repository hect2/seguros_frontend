import { create } from 'zustand';
import { User } from '../interfaces/auth.response';
import { loginAction } from '../actions/login.action';
import { checkAuthAction } from '../actions/check-auth';
import { Navigate } from 'react-router-dom';

type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking';

type AuthState = {
    // Properties
    user: User | null,
    token: string | null,
    authStatus: AuthStatus,

    // Getters
    isAdmin: () => boolean;
    roles: () => string[];

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({

    // Implementacion del Store
    user: null,
    token: null,
    authStatus: 'checking',

    // Getters
    isAdmin : () => {
        const roles = get().user?.role_names || [];

        return roles.includes('Super Administrador');
    },

    roles: () => {
        return get().user?.permission_names || [];
    },

    // Actions
    login: async(email: string, password: string) => {
        console.log({email, password})

        try {
            const data = await loginAction(email, password);
            localStorage.setItem('token', data.token);
            set({user: data.user, token: data.token, authStatus: 'authenticated'})
            return true;
        } catch (error) {
            localStorage.removeItem('token');
            set({user: null, token: null, authStatus: 'not-authenticated'})
            return false;
        }
    },
    logout: () => {
        console.log('logout authstate')
        localStorage.removeItem('token');
        set({user: null, token: null, authStatus: 'not-authenticated'})
        Navigate('/login')
    },
    checkAuthStatus: async() => {
        try {
            const {user, token} = await checkAuthAction();
            set({
                user: user,
                token: token,
                authStatus: 'authenticated',
            })
            return true;
        } catch (error) {
            set({
                user: undefined,
                token: undefined,
                authStatus: 'not-authenticated',
            })
            return false;
        }
    }
}));