import { apiClient } from '../utils/apiClient'
import type { LoginCredentials } from '../types/LoginCredentials'
import type { RegisterData } from '../types/RegisterData'

const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log('Tentative de connexion avec:', credentials)
      const response = await apiClient.post('/login', credentials, {
        withCredentials: true,
      })
      console.log('Réponse du serveur:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Erreur de connexion détaillée:', error)
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status)
        console.error("Données de l'erreur:", error.response.data)
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request)
      } else {
        console.error('Erreur de configuration de la requête:', error.message)
      }
      throw error
    }
  },

  async register(userData: RegisterData) {
    try {
      console.log("Tentative d'inscription avec:", userData)
      const response = await apiClient.post('/register', userData, {
        withCredentials: true,
      })
      console.log('Réponse du serveur:', response.data)
      return response.data
    } catch (error: any) {
      console.error("Erreur d'inscription détaillée:", error)
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status)
        console.error("Données de l'erreur:", error.response.data)
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request)
      } else {
        console.error('Erreur de configuration de la requête:', error.message)
      }
      throw error
    }
  },

  async refreshToken() {
    try {
      const response = await apiClient.post('/api/refresh-token');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error('Refresh token failed');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      this.logout();
      throw error;
    }
  },

  async logout() {
    await apiClient.post('/logout', {}, { withCredentials: true })
  },

  async getCurrentUser() {
    const response = await apiClient.get('/me', { withCredentials: true })
    console.log('/me response:', response.data)

    if (response) {
      return response.data.user
    }
    return null
  },
}

export default authService
