import { apiClient } from "../utils/apiClient";

interface PlanFormData {
  name: string;
  price: string;
  description: string;
}

const adminService = {
  async getPlans() {
    try {
      const response = await apiClient.get('/admin/subscription/plans');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      throw error;
    }
  },
  
  async createPlan(planData: PlanFormData) {
    try {
      const planDataForApi = {
        ...planData,
        price: String(planData.price)
      };
      
      const response = await apiClient.post('/admin/subscription/plans', planDataForApi);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  },
  
  async updatePlan(id: number, planData: PlanFormData) {
    try {
      const planDataForApi = {
        ...planData,
        price: String(planData.price)
      };
      
      const response = await apiClient.put(`/admin/subscription/plans/${id}`, planDataForApi);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du plan:', error);
      throw error;
    }
  },
  
  async deletePlan(id: number) {
    try {
      const response = await apiClient.delete(`/admin/subscription/plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      throw error;
    }
  },
  
  async getSubscriptions() {
    try {
      const response = await apiClient.get('/admin/subscription/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements:', error);
      throw error;
    }
  },
  
  async getPayments() {
    try {
      const response = await apiClient.get('/admin/subscription/payments');
      return response.data;
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

export default adminService;
export type { PlanFormData }; 