import axios from 'axios'
import authService from '../api/authService'
import { useAuthStore } from '../stores/useAuthStore'
console.log(import.meta.env.VITE_API_URL || '__VITE_API_URL__')
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '__VITE_API_URL__',
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const authStore = useAuthStore()

    if (error.response && error.response.status === 401 && !request._retry && authStore.isAuthenticated) {
 
     
     
      request._retry = true;

      await authService.logout()
      authStore.user = null
      authStore.isAuthenticated = false
    }

    return Promise.reject(error)
  },
)
