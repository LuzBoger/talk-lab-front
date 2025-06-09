import axios from 'axios';
import authService from '../api/authService';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept': 'application/json',
    },
})

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use (
  response => response,
  async error => {
    const request = error.config

    if (error.response && error.response.status === 401 && !request._retry){
      request._retry = true

      try{
        const refreshedToken = await authService.refreshToken()

        if(refreshedToken) {
          const token = localStorage.getItem('auth_token');
          request.headers.Authorization = `Bearer ${token}`;
          return apiClient(request);
        }

      } catch (e) {
        console.error('Erreur lors de la tentative de rafraîchissement du token:', e);
      }
      authService.logout()
    }
    return Promise.reject(error)
  }
)
