import { apiClient } from "../utils/apiClient";
import type { LoginCredentials } from "../types/LoginCredentials";
import type { RegisterData } from "../types/RegisterData";


const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log('Tentative de connexion avec:', credentials);
      const response = await apiClient.post('/login', credentials);
      console.log('Réponse du serveur:', response.data);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refresh_token)
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: any) {
      console.error('Erreur de connexion détaillée:', error);
      if (error.response) {
        console.error('Statut de l\'erreur:', error.response.status);
        console.error('Données de l\'erreur:', error.response.data);
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request);
      } else {
        console.error('Erreur de configuration de la requête:', error.message);
      }
      throw error;
    }
  },

  async register(userData: RegisterData) {
    try {
      console.log('Tentative d\'inscription avec:', userData);
      const response = await apiClient.post('/register', userData);
      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur d\'inscription détaillée:', error);
      if (error.response) {
        console.error('Statut de l\'erreur:', error.response.status);
        console.error('Données de l\'erreur:', error.response.data);
      } else if (error.request) {
        console.error('Pas de réponse reçue:', error.request);
      } else {
        console.error('Erreur de configuration de la requête:', error.message);
      }
      throw error;
    }
  },

  async refreshToken() {

    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('Auncun refresh token trouvé');
      }

      const response = await apiClient.post('/refresh-token', {refresh_token: refreshToken})

      if (response.data.token && response.data.refreshToken) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        return true
      }
      return false
    } catch (error: any) {
      console.error('Erreur lors de la tentative de rafraîchissement du token:', error);

      this.logout();
      return false
    }
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};

export default authService; 