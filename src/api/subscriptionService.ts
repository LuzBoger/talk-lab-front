import apiClient from './apiClient';

interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
}

interface Subscription {
  id: number;
  plan: Plan;
  status: string;
  duration: number;
  startAt?: string;
  endAt?: string;
}

interface SubscriptionHistory {
  id: number;
  subscription: {
    plan: Plan;
  };
  startAt: string;
  endAt: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  issuedAt: string;
}

const subscriptionService = {
  async getPlans() {
    try {
      const response = await apiClient.get('/api/subscription/plans');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      throw error;
    }
  },

  async getCurrentSubscription() {
    try {
      const response = await apiClient.get('/api/subscription/current');
      return response.data;
    } catch (error: any) {
      // Ne pas logger les erreurs 404 car c'est normal quand l'utilisateur n'a pas d'abonnement
      if (error.response?.status !== 404) {
        console.error('Erreur lors de la récupération de l\'abonnement actuel:', error);
      }
      throw error;
    }
  },

  async subscribe(planId: number) {
    try {
      const response = await apiClient.post(`/api/subscription/subscribe/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la souscription:', error);
      throw error;
    }
  },

  async changeSubscription(planId: number) {
    try {
      const response = await apiClient.post(`/api/subscription/change/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du changement d\'abonnement:', error);
      throw error;
    }
  },

  async cancelSubscription() {
    try {
      const response = await apiClient.post('/api/subscription/cancel');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  },

  async getSubscriptionHistory() {
    try {
      const response = await apiClient.get('/api/subscription/history');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      throw error;
    }
  },

  async getInvoices() {
    try {
      const response = await apiClient.get('/api/subscription/invoices');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
      throw error;
    }
  },
};

export default subscriptionService;
export type { Plan, Subscription, SubscriptionHistory, Invoice }; 