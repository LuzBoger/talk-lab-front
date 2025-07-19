import { apiClient } from "../utils/apiClient";

interface User {
  id: number;
  name: string;
  email: string;
  hasSubscription: boolean;
  subscriptionStatus: string | null;
  planName: string | null;
}

interface UserSubscription {
  id: number;
  duration: number;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  plan: {
    id: number;
    name: string;
    price: string;
    description: string;
  };
}

interface Subscription {
  id: number;
  plan: {
    id: number;
    name: string;
    price: string;
  };
  status: string;
  duration: number;
  users?: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

interface Payment {
  id: number;
  amount: string;
  status: string;
  createdAt: string;
  subscription: Subscription;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
}

const adminSubscriptionService = {
  async getUsers() {
    try {
      const response = await apiClient.get('/admin/subscription/users');
      return response.data.users;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  async getUserSubscription(userId: number) {
    try {
      const response = await apiClient.get(`/admin/subscription/users/${userId}/subscription`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement utilisateur:', error);
      throw error;
    }
  },

  async getSubscriptions() {
    try {
      const response = await apiClient.get('/admin/subscription/subscriptions');
      return response.data.subscriptions;
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      throw error;
    }
  },

  async cancelSubscription(subscriptionId: number) {
    try {
      const response = await apiClient.post(`/admin/subscription/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
      throw new Error(`Erreur d'annulation: ${errorMessage}`);
    }
  },

  async deleteSubscription(subscriptionId: number) {
    try {
      const response = await apiClient.delete(`/admin/subscription/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'abonnement:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue';
      throw new Error(`Erreur de suppression: ${errorMessage}`);
    }
  },

  async getPlans() {
    try {
      const response = await apiClient.get('/admin/subscription/plans');
      return response.data.plans;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      throw error;
    }
  },

  async createPlan(planData: { name: string; price: string; description: string }) {
    try {
      const response = await apiClient.post('/admin/subscription/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  },

  async updatePlan(planId: number, planData: { name: string; price: string; description: string }) {
    try {
      const response = await apiClient.put(`/admin/subscription/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plan:', error);
      throw error;
    }
  },

  async deletePlan(planId: number) {
    try {
      const response = await apiClient.delete(`/admin/subscription/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      throw error;
    }
  },

  async getPayments() {
    try {
      const response = await apiClient.get('/admin/subscription/payments');
      return response.data.payments;
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      throw error;
    }
  },

  async getReports() {
    try {
      const response = await apiClient.get('/admin/subscription/reports');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      throw error;
    }
  }
};

export default adminSubscriptionService;
export type { User, UserSubscription, Subscription, Payment, Plan }; 