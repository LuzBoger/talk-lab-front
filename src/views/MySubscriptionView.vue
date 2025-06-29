<template>
  <div class="my-subscription-container">
    <h1>Mon abonnement</h1>
    
    <div class="message success" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="message error" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement...</p>
    </div>
    
    <template v-else>
      <div class="subscription-card" v-if="subscription && subscription.plan">
        <div class="card-header">
          <h2>Détails de votre abonnement actuel</h2>
        </div>
        <div class="card-content">
          <div class="subscription-details">
            <div class="plan-info">
              <h3>{{ subscription.plan.name }}</h3>
              <p class="description">{{ subscription.plan.description }}</p>
              <p class="price">Prix: {{ formatPrice(subscription.plan.price) }} € /mois</p>
              <p>Durée: {{ subscription.duration }} jours</p>
            </div>
            <div class="status-info">
              <p>
                Statut: 
                <span 
                  class="status-badge"
                  :class="{
                    'active': subscription.status === 'active',
                    'expired': subscription.status === 'expired',
                    'canceled': subscription.status === 'canceled'
                  }"
                >
                  {{ formatStatus(subscription.status) }}
                </span>
              </p>
              
              <template v-if="subscriptionHistory && subscriptionHistory.length > 0">
                <p>Date de début: {{ formatDate(subscriptionHistory[0].startAt) }}</p>
                <p>Date de fin: {{ formatDate(subscriptionHistory[0].endAt) }}</p>
                <p>Jours restants: {{ calculateDaysLeft(subscriptionHistory[0].endAt, subscription.status) }}</p>
              </template>
            </div>
          </div>
          
          <div class="actions">
            <button 
              v-if="subscription.status === 'active'" 
              class="cancel-button"
              @click="confirmCancel"
            >
              Annuler mon abonnement
            </button>
            <router-link 
              v-else 
              to="/subscription/plans" 
              class="view-plans-button"
            >
              Voir les plans disponibles
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="no-subscription" v-if="!subscription || !subscription.plan">
        <p>Vous n'avez actuellement aucun abonnement actif.</p>
        <router-link to="/subscription/plans" class="view-plans-button">
          Voir les plans disponibles
        </router-link>
      </div>
      
      <div class="history-card" v-if="subscriptionHistory && subscriptionHistory.length > 0">
        <div class="card-header">
          <h2>Historique de mes abonnements</h2>
        </div>
        <div class="card-content">
          <table class="history-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Début</th>
                <th>Fin</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in subscriptionHistory" :key="index">
                <td>{{ item.subscription?.plan?.name || 'N/A' }}</td>
                <td>{{ formatDate(item.startAt) }}</td>
                <td>{{ formatDate(item.endAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="modal-content" @click.stop>
        <h3>Confirmation d'annulation</h3>
        <p>Êtes-vous sûr de vouloir annuler votre abonnement?</p>
        <p>Vous aurez toujours accès jusqu'à la fin de la période payée.</p>
        <div class="modal-actions">
          <button class="cancel-action" @click="showCancelModal = false">Annuler</button>
          <button class="confirm-action" @click="cancelSubscription">Confirmer l'annulation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import subscriptionService from '../api/subscriptionService';
import type { Subscription, SubscriptionHistory } from '../api/subscriptionService';

export default defineComponent({
  name: 'MySubscriptionView',
  setup() {
    const subscription = ref<Subscription | null>(null);
    const subscriptionHistory = ref<SubscriptionHistory[]>([]);
    const loading = ref(true);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showCancelModal = ref(false);
    
    let lastFetch = 0;
    let isFetching = false;
    const CACHE_DURATION = 15000; 

    const fetchSubscriptionDetails = async (forceRefresh = false) => {
      const now = Date.now();
      
      if (!forceRefresh && now - lastFetch < CACHE_DURATION && subscription.value !== null) {
        loading.value = false;
        return;
      }

      if (isFetching) {
        return;
      }

      loading.value = true;
      isFetching = true;
      errorMessage.value = '';
      
      try {
        const currentSubscription = await subscriptionService.getCurrentSubscription();
        subscription.value = currentSubscription;
        lastFetch = now;

        try {
          const history = await subscriptionService.getSubscriptionHistory();
          subscriptionHistory.value = history;
        } catch (historyError) {
          console.error('Erreur lors de la récupération de l\'historique:', historyError);
          subscriptionHistory.value = [];
        }
      } catch (error: any) {
        console.error('Erreur lors de la récupération des détails d\'abonnement:', error);
        if (error.response?.status === 404) {
          subscription.value = null;
          lastFetch = now; 
        } else if (error.name === 'AxiosError' && error.code === 'ECONNABORTED') {
          errorMessage.value = 'La demande a pris trop de temps. Le serveur est temporairement surchargé. Veuillez réessayer dans quelques instants.';
        } else {
          errorMessage.value = 'Impossible de charger les détails de votre abonnement. Veuillez réessayer.';
        }
      } finally {
        loading.value = false;
        isFetching = false;
      }
    };

    const confirmCancel = () => {
      showCancelModal.value = true;
    };

    const cancelSubscription = async () => {
      try {
        const response = await subscriptionService.cancelSubscription();
        successMessage.value = response.message || 'Votre abonnement a été annulé avec succès.';
        
        if (subscription.value) {
          subscription.value.status = 'canceled';
        }
        
        showCancelModal.value = false;
        
        lastFetch = 0;
      } catch (error: any) {
        console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
        if (error.name === 'AxiosError' && error.code === 'ECONNABORTED') {
          errorMessage.value = 'La demande d\'annulation a pris trop de temps. Veuillez vérifier votre abonnement et réessayer si nécessaire.';
        } else {
          errorMessage.value = error.response?.data?.message || 'Une erreur est survenue lors de l\'annulation. Veuillez réessayer.';
        }
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
      } catch (e) {
        return 'N/A';
      }
    };

    const formatPrice = (price: string | number) => {
      if (!price) return '0.00';
      return Number(price).toFixed(2);
    };

    const formatStatus = (status: string) => {
      switch (status) {
        case 'active': return 'Actif';
        case 'expired': return 'Expiré';
        case 'canceled': return 'Annulé';
        default: return status || 'Inconnu';
      }
    };

    const calculateDaysLeft = (endDateString: string, status: string) => {
      if (status !== 'active' || !endDateString) {
        return '0 jour(s)';
      }
      
      try {
        const endDate = new Date(endDateString);
        const today = new Date();
        
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays > 0 ? `${diffDays} jour(s)` : '0 jour(s)';
      } catch (e) {
        return '0 jour(s)';
      }
    };

    onMounted(() => {
      fetchSubscriptionDetails();
    });

    return {
      subscription,
      subscriptionHistory,
      loading,
      successMessage,
      errorMessage,
      showCancelModal,
      confirmCancel,
      cancelSubscription,
      formatDate,
      formatPrice,
      formatStatus,
      calculateDaysLeft
    };
  }
});
</script>

<style scoped>
.my-subscription-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #1A192C;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.success {
  background-color: #DEF7EC;
  color: #03543F;
}

.error {
  background-color: #FDE8E8;
  color: #9B1C1C;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7C3AED;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.subscription-card, .history-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1A192C;
}

.card-content {
  padding: 1.5rem;
}

.subscription-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: #DEF7EC;
  color: #03543F;
}

.status-badge.expired {
  background-color: #FEF3C7;
  color: #92400E;
}

.status-badge.canceled {
  background-color: #FDE8E8;
  color: #9B1C1C;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

.cancel-button, .view-plans-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.cancel-button {
  background-color: #FDE8E8;
  color: #9B1C1C;
  border: none;
}

.view-plans-button {
  background-color: #7C3AED;
  color: white;
  border: none;
}

.cancel-button:hover {
  background-color: #FBD5D5;
}

.view-plans-button:hover {
  background-color: #6D28D9;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.history-table th {
  font-weight: 600;
  color: #4B5563;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1A192C;
}

.modal-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-action, .confirm-action {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.cancel-action {
  background-color: #F3F4F6;
  color: #4B5563;
}

.confirm-action {
  background-color: #DC2626;
  color: white;
}

.no-subscription {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .subscription-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .cancel-button, .view-plans-button {
    width: 100%;
    text-align: center;
  }
}
</style> 