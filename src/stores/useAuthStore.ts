import { defineStore } from "pinia";
import { ref } from "vue";
import authService from "../api/authService";
import type { LoginCredentials } from "../types/LoginCredentials";
import type { RegisterData } from "../types/RegisterData";
import type { User } from "../types/User";



export const useAuthStore = defineStore ('auth', () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);
    const isTwoFactorEnable = ref(false)
    const tempCredentials = ref<LoginCredentials | null>(null)

    const setUser = (newUser: User | null) => {
        user.value = newUser;
        isAuthenticated.value = !!newUser;
    };

    const getUser = async () => {
        try {
            const currentUser = await authService.getCurrentUser();
                   console.log('getUser - currentUser:', currentUser);
            if(currentUser) {
                user.value = currentUser
                isAuthenticated.value = true
                isTwoFactorEnable.value = !!currentUser.isTwofactorEnabled
            } else {
                user.value = null
                isAuthenticated.value = false
                isAuthenticated.value = false
            }

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            user.value = null;
            isAuthenticated.value = false;
        }
    }


    const login = async (credentials: LoginCredentials) => {
        const response = await authService.login(credentials);
        console.log("Valuer de ", response.isTwoFactorEnabled)
        if(response.isTwoFactorEnabled) {
            isTwoFactorEnable.value = true
            tempCredentials.value = credentials
            return false
        }
        isTwoFactorEnable.value = false
        await getUser();
        return true

    }


    const loginGoogle = async (token: string) => {
        try {
            const response = await authService.loginWithGoogle(token)
            if(response.isTwoFactorEnabled) {
                isTwoFactorEnable.value = true
                return false
        }

            isTwoFactorEnable.value = false
            await getUser();
            return true
        } catch (error) {
            console.error('Erreur lors de la connexion avec Google:', error);
            throw error;
        }
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

    const verifyTotp = async (code: string) => {

        if(!tempCredentials.value) {
            throw new Error("Utilisateur non connecté");
        }

        const {email, password} = tempCredentials.value
        const res = await login({email, password, totpCode:code})
        if(!res) {
                throw new Error("Code 2FA invalide");
        }

        isTwoFactorEnable.value = false
        tempCredentials.value = null
        await getUser()
        return true

    }

    return { user, isAuthenticated, isTwoFactorEnable,verifyTotp, getUser, setUser,login,loginGoogle, register, logout}
})