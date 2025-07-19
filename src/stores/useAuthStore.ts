import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '../api/authService'
import type { LoginCredentials } from '../types/LoginCredentials'
import type { RegisterData } from '../types/RegisterData'
import type { User } from '../types/User'

export const useAuthStore = defineStore('auth', () => {
  console.log('useAuthStore initialized')
  console.log(import.meta.env.VITE_API_URL || '__VITE_API_URL__')
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isAuthLoading = ref(true)
  const isTwoFactorEnable = ref(false)
  const tempCredentials = ref<LoginCredentials | null>(null)

  const setUser = (newUser: User | null) => {
    user.value = newUser
    isAuthenticated.value = !!newUser
  }

  const loadUser = async () => {
    isAuthLoading.value = true
    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      isAuthenticated.value = !!currentUser
      isTwoFactorEnable.value = !!currentUser?.isTwofactorEnabled
    } catch (e) {
      user.value = null
      isAuthenticated.value = false
    } finally {
      isAuthLoading.value = false
    }
  }

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    console.log('Valuer de ', response.isTwoFactorEnabled)
    if (response.isTwoFactorEnabled) {
      isTwoFactorEnable.value = true
      tempCredentials.value = credentials
      return false
    }
    isTwoFactorEnable.value = false
    await loadUser()
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
            await loadUser();
            return true
        } catch (error) {
            console.error('Erreur lors de la connexion avec Google:', error);
            throw error;
        }
    }


  const register = async (userData: RegisterData) => {
    await authService.register(userData)
    await loadUser()
  }

  const logout = async () => {
    // Nettoyer l'état local AVANT l'appel API
    user.value = null
    isAuthenticated.value = false
    isTwoFactorEnable.value = false

    try {
      await authService.logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }

    // Force la suppression des cookies côté client car le backend les recrée
    setTimeout(() => {
      document.cookie =
        'BEARER=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie =
        'REFRESH_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      console.log('Cookies supprimés après logout')
    }, 100)
  }

  const verifyTotp = async (code: string) => {
    if (!tempCredentials.value) {
      throw new Error('Utilisateur non connecté')
    }

    const { email, password } = tempCredentials.value
    const res = await login({ email, password, totpCode: code })
    if (!res) {
      throw new Error('Code 2FA invalide')
    }

    isTwoFactorEnable.value = false
    tempCredentials.value = null
    await loadUser()
    return true
  }

  return {
    user,
    isAuthenticated,
    isAuthLoading,
    isTwoFactorEnable,
    verifyTotp,
    loadUser,
    setUser,
    login,loginGoogle,
    register,
    logout,
  }
})
