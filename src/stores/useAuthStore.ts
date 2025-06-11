import { defineStore } from "pinia";
import { ref } from "vue";
import authService from "../api/authService";
import type { LoginCredentials } from "../types/LoginCredentials";
import type { RegisterData } from "../types/RegisterData";
import type { User } from "../types/User";


export const useAuthStore = defineStore ('auth', () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);


    const getUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
                   console.log('getUser - currentUser:', currentUser);
            if(currentUser) {
                user.value = currentUser
                isAuthenticated.value = true;
            } else {
                user.value = null
                isAuthenticated.value = false
            }

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            user.value = null;
            isAuthenticated.value = false;
        }
    }


    const login = async (credentials: LoginCredentials) => {
        await authService.login(credentials);
        await getUser();
    }

    const register = async (userData : RegisterData) => {
        await authService.register(userData)
        await getUser();
    }

    const logout = async () => {
        await authService.logout();
        user.value = null;
        isAuthenticated.value = false;
    }


    return { user, isAuthenticated, getUser, login, register, logout}
})