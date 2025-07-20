import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../api/authService'
import type { LoginCredentials } from '../types/login/LoginCredentials'
import type { RegisterData } from '../types/register/RegisterData'
import subscriptionService from '../api/subscriptionService'
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

  const userHasSubscription = ref(false)
  const userSubscriptionStatus = ref<string | null>(null)

  const setUser = (newUser: User | null) => {
    user.value = newUser
    isAuthenticated.value = !!newUser
  }

  const loadSubscriptionInfo = async () => {
    if (!isAuthenticated.value) {
      userHasSubscription.value = false
      userSubscriptionStatus.value = null
      return
    }

    try {
      const response = await subscriptionService.getCurrentSubscription()
      userHasSubscription.value = response?.status === 'active'
      userSubscriptionStatus.value = response?.status || null
    } catch (error: any) {
      if (error.response?.status === 404) {
        userHasSubscription.value = false
        userSubscriptionStatus.value = null
      } else {
        console.error("Erreur lors de la récupération de l'abonnement:", error)
        userHasSubscription.value = false
        userSubscriptionStatus.value = null
      }
    }
  }

  const loadUser = async () => {
    isAuthLoading.value = true
    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      isAuthenticated.value = !!currentUser
      isTwoFactorEnable.value = !!currentUser?.isTwofactorEnabled

      await loadSubscriptionInfo()
    } catch (e) {
      user.value = null
      isAuthenticated.value = false
      userHasSubscription.value = false
      userSubscriptionStatus.value = null
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
      if (response.isTwoFactorEnabled) {
        isTwoFactorEnable.value = true
        return false
      }

      isTwoFactorEnable.value = false
      await loadUser()
      return true
    } catch (error) {
      console.error('Erreur lors de la connexion avec Google:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    await authService.register(userData)
    await loadUser()
  }

  const logout = async () => {
    user.value = null
    isAuthenticated.value = false
    isTwoFactorEnable.value = false
    userHasSubscription.value = false
    userSubscriptionStatus.value = null

    try {
      await authService.logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }

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

  const hasSubscription = computed(() => userHasSubscription.value)
  const subscriptionStatus = computed(() => userSubscriptionStatus.value)

  return {
    user,
    isAuthenticated,
    isAuthLoading,
    isTwoFactorEnable,
    hasSubscription,
    subscriptionStatus,
    verifyTotp,
    loadUser,
    loadSubscriptionInfo,
    setUser,
    login,
    loginGoogle,
    register,
    logout,
  }
})
