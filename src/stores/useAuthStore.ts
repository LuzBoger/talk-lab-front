import { defineStore } from 'pinia'
import { ref } from 'vue'
import authService from '../api/authService'
import type { LoginCredentials } from '../types/LoginCredentials'
import type { RegisterData } from '../types/RegisterData'
import type { User } from '../types/User'

export const useAuthStore = defineStore('auth', () => {
  console.log('useAuthStore initialized')
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isTwoFactorEnable = ref(false)
  const tempCredentials = ref<LoginCredentials | null>(null)

  const setUser = (newUser: User | null) => {
    user.value = newUser
    isAuthenticated.value = !!newUser
  }

  const getUser = async () => {
    console.log('suis-je la ?')
    try {
      const currentUser = await authService.getCurrentUser()
      console.log('getUser - currentUser:', currentUser)
      if (currentUser) {
        user.value = currentUser
        isAuthenticated.value = true
        isTwoFactorEnable.value = !!currentUser.isTwofactorEnabled
      } else {
        user.value = null
        isAuthenticated.value = false
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error)
      user.value = null
      isAuthenticated.value = false
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
    await getUser()
    return true
  }

  const register = async (userData: RegisterData) => {
    await authService.register(userData)
    await getUser()
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
      document.cookie = 'BEARER=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      document.cookie = 'REFRESH_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
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
    await getUser()
    return true
  }

  return {
    user,
    isAuthenticated,
    isTwoFactorEnable,
    verifyTotp,
    getUser,
    setUser,
    login,
    register,
    logout,
  }
})
