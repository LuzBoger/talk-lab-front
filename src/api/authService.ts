import apiClient from './apiClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  username?: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string | null;
  roles?: string[];
}

const authService = {
  async login(credentials: LoginCredentials) {
    try {
      console.log('Tentative de connexion avec:', credentials);
      const response = await apiClient.post('/api/login', credentials);
      console.log('Réponse du serveur:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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
      const response = await apiClient.post('/api/register', userData);
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        user.roles = payload.roles || [];
      }
      return user;
    } catch (e) {
      console.error('Erreur lors de la récupération des informations utilisateur:', e);
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  },

  isAdmin(): boolean {
    try {
      const user = this.getCurrentUser();
      if (!user || !user.roles) {
        return false;
      }
      return user.roles.includes('ROLE_ADMIN');
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle admin:', error);
      return false;
    }
  }
};

export default authService; 