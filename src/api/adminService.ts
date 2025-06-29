import apiClient from './apiClient';

interface PlanFormData {
  name: string;
  price: string;
  description: string;
}

const adminService = {
  async getPlans() {
    try {
      const response = await apiClient.get('/api/admin/subscription/plans');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      throw error;
    }
  },
  
  async createPlan(planData: PlanFormData) {
    try {
      const response = await apiClient.post('/api/admin/subscription/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  },
  
  async updatePlan(id: number, planData: PlanFormData) {
    try {
      const response = await apiClient.put(`/api/admin/subscription/plans/${id}`, planData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plan:', error);
      throw error;
    }
  },
  
  async deletePlan(id: number) {
    try {
      const response = await apiClient.delete(`/api/admin/subscription/plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      throw error;
    }
  },
  
  async getSubscriptions() {
    try {
      const response = await apiClient.get('/api/admin/subscription/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      throw error;
    }
  },
  
  async getPayments() {
    try {
      const response = await apiClient.get('/api/admin/subscription/payments');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      throw error;
    }
  },
  
  async getReports() {
    try {
      const response = await apiClient.get('/api/admin/subscription/reports');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      throw error;
    }
  }
};

export default adminService;
export type { PlanFormData }; 