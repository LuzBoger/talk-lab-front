import axios from 'axios';
import authService from '../api/authService';
import { useAuthStore } from '../stores/useAuthStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const request = error.config;
    const authStore = useAuthStore()

    if (error.response && error.response.status === 401 && !request._retry && authStore.isAuthenticated) {
      request._retry = true;

      try {
        const refreshed = await authService.refreshToken();

        if (refreshed) { return apiClient(request);}
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token :', refreshError);
      }

      await authService.logout();
      authStore.user = null;
      authStore.isAuthenticated = false;
    }

    return Promise.reject(error);
  }
);
