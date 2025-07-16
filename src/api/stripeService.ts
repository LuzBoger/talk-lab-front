import { apiClient } from '../utils/apiClient';

export interface StripeConfig {
  publishableKey: string;
}

export interface CheckoutSession {
  checkout_url: string;
  session_id: string;
}

class StripeService {
  private stripeConfig: StripeConfig | null = null;

  /**
   * Récupérer la configuration Stripe
   */
  async getConfig(): Promise<StripeConfig> {
    if (!this.stripeConfig) {
      try {
        const response = await apiClient.get('/stripe/config');
        this.stripeConfig = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la config Stripe:', error);
        throw error;
      }
    }
    return this.stripeConfig!;
  }

  /**
   * Créer une session de checkout pour un abonnement
   */
  async createCheckoutSession(planId: number): Promise<CheckoutSession> {
    try {
      const response = await apiClient.post('/stripe/create-checkout-session', {
        plan_id: planId
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la session checkout:', error);
      throw error;
    }
  }

  /**
   * Rediriger vers Stripe Checkout
   */
  async redirectToCheckout(planId: number): Promise<void> {
    try {
      const session = await this.createCheckoutSession(planId);
      
      // Rediriger vers l'URL de checkout Stripe
      window.location.href = session.checkout_url;
    } catch (error) {
      console.error('Erreur lors de la redirection vers checkout:', error);
      throw error;
    }
  }

  /**
   * Vérifier le statut d'une session de checkout
   */
  async checkSessionStatus(sessionId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/stripe/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'un paiement
   */
  async getPaymentDetails(paymentIntentId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/stripe/payment/${paymentIntentId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de paiement:', error);
      throw error;
    }
  }

  /**
   * Synchroniser les plans avec Stripe (admin uniquement)
   */
  async syncPlans(): Promise<any> {
    try {
      const response = await apiClient.post('/stripe/sync-plans');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des plans:', error);
      throw error;
    }
  }

  /**
   * Synchroniser les abonnements avec Stripe (admin uniquement)
   */
  async syncSubscriptions(): Promise<any> {
    try {
      const response = await apiClient.post('/stripe/sync-subscriptions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des abonnements:', error);
      throw error;
    }
  }

  /**
   * Vérifier l'abonnement d'un utilisateur (admin uniquement)
   */
  async checkUserSubscription(email: string): Promise<any> {
    try {
      const response = await apiClient.get(`/stripe/check-user-subscription/${email}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Debug de la situation d'un utilisateur (résolution automatique)
   */
  async debugUserSituation(): Promise<any> {
    try {
      const response = await apiClient.get('/stripe/debug-user-situation');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du debug:', error);
      throw error;
    }
  }

  /**
   * Traiter le succès d'un checkout Stripe
   */
  async processCheckoutSuccess(sessionId: string): Promise<any> {
    try {
      const response = await apiClient.post('/stripe/checkout-success', {
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du traitement du checkout success:', error);
      throw error;
    }
  }
}

export default new StripeService(); 