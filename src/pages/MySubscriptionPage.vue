<template>
  <div class="my-subscription-container">
    <h1>Mon abonnement</h1>
    
    
    
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
            <template v-if="subscription.status === 'active'">
              <button 
                class="cancel-button"
                @click="confirmCancel"
              >
                ❌ Résilier mon abonnement
              </button>
            </template>
            
            <template v-else-if="subscription.status === 'canceled'">
              <div class="cancellation-notice">
                <div class="cancellation-status">
                  <h3>🚫 Abonnement résilié</h3>
                  <p class="cancellation-info">
                    Votre abonnement a été résilié avec succès. Vous conservez l'accès à tous les services jusqu'à la fin de votre période payée.
                  </p>
                </div>
                
                <div class="remaining-time" v-if="subscriptionHistory && subscriptionHistory.length > 0">
                  <div class="time-info">
                    <span class="label">🕒 Fin d'accès :</span>
                    <span class="date">{{ formatDate(subscriptionHistory[0].endAt) }}</span>
                  </div>
                  <div class="time-info">
                    <span class="label">⏳ Temps restant :</span>
                    <span class="remaining">{{ calculateDaysLeft(subscriptionHistory[0].endAt, subscription.status) }}</span>
                  </div>
                </div>
                
                <div class="resubscribe-action">
                  <router-link to="/subscription/plans" class="resubscribe-button">
                    🔄 Reprendre un abonnement
                  </router-link>
                </div>
              </div>
            </template>
            
            <template v-else>
              <router-link 
                to="/subscription/plans" 
                class="view-plans-button"
              >
                Voir les plans disponibles
              </router-link>
            </template>
          </div>
          
          <div class="subscription-policy-notice" v-if="subscription.status === 'active'">
            <h4>ℹ️ Politique de changement et de résiliation</h4>
            <div class="policy-item">
              <strong>🔄 Changement de plan :</strong>
              <p>Pour changer votre plan, vous devez attendre la fin de votre période actuelle 
              <span v-if="subscriptionHistory && subscriptionHistory.length > 0">
                (fin le <strong>{{ formatDate(subscriptionHistory[0].endAt) }}</strong>)
              </span>. 
              Le nouveau plan prendra effet automatiquement à cette date.</p>
            </div>
            <div class="policy-item">
              <strong>❌ Résiliation :</strong>
              <p>En cas de résiliation, votre abonnement restera actif jusqu'à la fin de la période payée. 
              Aucun remboursement n'est possible pour la période déjà entamée.</p>
            </div>
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
        <h3>⚠️ Confirmation de résiliation d'abonnement</h3>
        
        <div class="cancel-policy-info">
          <h4>📅 Politique de résiliation :</h4>
          <ul>
            <li>Votre abonnement restera <strong>actif jusqu'à la fin de la période payée</strong></li>
            <li v-if="subscriptionHistory && subscriptionHistory.length > 0">
              Date de fin d'accès : <strong>{{ formatDate(subscriptionHistory[0].endAt) }}</strong>
            </li>
            <li>Aucun renouvellement automatique ne sera effectué</li>
            <li v-if="subscriptionHistory && subscriptionHistory.length > 0 && subscription">
              Vous garderez l'accès complet pendant {{ calculateDaysLeft(subscriptionHistory[0].endAt, subscription.status) }}
            </li>
          </ul>
          
          <p class="warning-text">
            ⚠️ <strong>Important :</strong> La résiliation sera effective immédiatement et ne pourra pas être annulée. 
            Vous ne pourrez pas réactiver ce même abonnement.
          </p>
        </div>

        <p class="confirmation-question">Êtes-vous sûr de vouloir procéder à la résiliation ?</p>
        
                  <div class="modal-actions">
            <button class="cancel-action" @click="showCancelModal = false">Non, garder mon abonnement</button>
            <button class="confirm-action" @click="cancelSubscription">Oui, résilier définitivement</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import subscriptionService from '../api/subscriptionService';
import stripeService from '../api/stripeService';
import { useRoute } from 'vue-router';
import type { Subscription, SubscriptionHistory } from '../api/subscriptionService';

export default defineComponent({
  name: 'MySubscriptionPage',
  setup() {
    const route = useRoute();
    const subscription = ref<Subscription | null>(null);
    const subscriptionHistory = ref<SubscriptionHistory[]>([]);
    const loading = ref(true);
    const successMessage = ref('');
    const errorMessage = ref('');
    const showCancelModal = ref(false);
    
    let lastFetch = 0;
    let isFetching = false;
    const CACHE_DURATION = 15000; 

    const processPaymentSuccess = async (sessionId: string) => {
      try {
        console.log('🔄 Traitement du paiement pour session:', sessionId);
        
        await stripeService.processCheckoutSuccess(sessionId);
        
        successMessage.value = 'Paiement traité avec succès ! Votre abonnement a été activé.';
        
        setTimeout(() => {
          fetchSubscriptionDetails(true);
        }, 1000);
        
      } catch (error) {
        console.error('❌ Erreur lors du traitement du paiement:', error);
        errorMessage.value = 'Paiement réussi mais erreur de traitement. Votre abonnement sera activé sous peu.';
        
        setTimeout(() => {
          fetchSubscriptionDetails(true);
        }, 2000);
      }
    };

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
          console.log('🔧 DEBUG: 404 - Aucun abonnement trouvé, tentative de résolution automatique...');
          
          try {
            console.log('🔧 DEBUG: Appel de debug automatique Stripe');
            const debugResult = await stripeService.debugUserSituation();
            console.log('🔧 DEBUG: Résultat debug:', debugResult);
            
            if (debugResult.auto_association) {
              successMessage.value = '✅ Abonnement Stripe récupéré et associé automatiquement !';
              console.log('🎉 Association automatique réussie:', debugResult.auto_association);
              
              setTimeout(() => {
                fetchSubscriptionDetails(true);
              }, 1000);
              
              return;
            } else if (debugResult.stripe_subscriptions && debugResult.stripe_subscriptions.length > 0) {
              errorMessage.value = '⚠️ Abonnement trouvé sur Stripe mais non associé. Contactez l\'administrateur pour la synchronisation.';
              console.log('🔧 DEBUG: Abonnements Stripe trouvés:', debugResult.stripe_subscriptions);
            } else {
              subscription.value = null;
            }
          } catch (debugError) {
            console.error('🔧 DEBUG: Erreur lors du debug automatique:', debugError);
            subscription.value = null;
          }
          
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
        
        if (subscription.value) {
          subscription.value.status = 'canceled';
        }
        
        showCancelModal.value = false;
        
        setTimeout(() => {
          fetchSubscriptionDetails(true);
        }, 500);
        
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
        case 'canceled': return 'Résilié';
        default: return status || 'Inconnu';
      }
    };

    const calculateDaysLeft = (endDateString: string, status: string) => {
      if ((status !== 'active' && status !== 'canceled') || !endDateString) {
        return '0 jour(s)';
      }
      
      try {
        const endDate = new Date(endDateString);
        const today = new Date();
        
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
          return status === 'canceled' 
            ? `${diffDays} jour(s) d'accès restant` 
            : `${diffDays} jour(s)`;
        } else {
          return status === 'canceled' 
            ? 'Accès expiré' 
            : '0 jour(s)';
        }
      } catch (e) {
        return '0 jour(s)';
      }
    };

    const tryRecoverSubscription = async () => {
      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      try {
        console.log('🔍 Tentative de récupération manuelle...');
        const debugResult = await stripeService.debugUserSituation();
        console.log('Debug result:', debugResult);
        
        if (debugResult.auto_association) {
          successMessage.value = '✅ Abonnement Stripe récupéré et associé !';
          setTimeout(() => {
            fetchSubscriptionDetails(true);
          }, 1000);
        } else if (debugResult.stripe_subscriptions && debugResult.stripe_subscriptions.length > 0) {
          successMessage.value = `🔍 ${debugResult.stripe_subscriptions.length} abonnement(s) trouvé(s) sur Stripe. Consultez la console pour plus de détails.`;
        } else {
          errorMessage.value = 'Aucun abonnement trouvé sur Stripe pour votre compte.';
        }
      } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        errorMessage.value = 'Erreur lors de la vérification sur Stripe.';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      const success = route.query.success;
      const sessionId = route.query.session_id;
      
      if (success === 'true' && sessionId) {
        successMessage.value = 'Paiement réussi ! Traitement en cours...';
        console.log('🎉 Paiement Stripe réussi, session ID:', sessionId);
        
        processPaymentSuccess(sessionId as string);
        
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (route.query.canceled === 'true') {
        errorMessage.value = 'Paiement annulé. Vous pouvez réessayer à tout moment.';
        console.log('❌ Paiement Stripe annulé');
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      fetchSubscriptionDetails();
    });

    const showChangeWarning = () => {
      if (subscriptionHistory.value && subscriptionHistory.value.length > 0) {
        const endDate = formatDate(subscriptionHistory.value[0].endAt);
        const daysLeft = calculateDaysLeft(subscriptionHistory.value[0].endAt, subscription.value?.status || 'active');
        
        alert(`⚠️ Politique de changement de plan :\n\n` +
              `Votre abonnement actuel reste valide jusqu'au ${endDate} (${daysLeft}).\n\n` +
              `Si vous souscrivez à un nouveau plan maintenant :\n` +
              `• Vous serez facturé immédiatement pour le nouveau plan\n` +
              `• Le nouveau plan démarrera à la fin de votre période actuelle\n` +
              `• Aucun remboursement au prorata ne sera effectué\n\n` +
              `Êtes-vous sûr de vouloir continuer ?`);
      }
      
      window.location.href = '/subscription/plans';
    };

    return {
      subscription,
      subscriptionHistory,
      loading,
      successMessage,
      errorMessage,
      showCancelModal,
      confirmCancel,
      cancelSubscription,
      showChangeWarning,
      formatDate,
      formatPrice,
      formatStatus,
      calculateDaysLeft,
      tryRecoverSubscription
    };
  }
});
</script>

<style scoped>
.my-subscription-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-bg-dark);
  min-height: 100vh;
}

h1 {
  color: var(--color-text-primary);
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 700;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid transparent;
}

.success {
  background-color: var(--color-validate-button);
  color: white;
  border-color: var(--color-validate-button);
}

.error {
  background-color: var(--color-cancel-color);
  color: white;
  border-color: var(--color-cancel-color);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-primary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-auth-button);
  border-top: 4px solid var(--color-main-color);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.subscription-card, .history-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.card-header {
  background: var(--color-sidebar-bg);
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border-auth-button);
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-primary);
  font-weight: 600;
}

.card-content {
  padding: 1.5rem;
}

.subscription-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.plan-info h3 {
  color: var(--color-text-primary);
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.plan-info p, .status-info p {
  color: var(--color-text-primary);
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.plan-info .description {
  opacity: 0.7;
  font-size: 0.95rem;
}

.plan-info .price {
  color: var(--color-main-color);
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: var(--color-validate-button);
  color: white;
}

.status-badge.expired {
  background-color: var(--color-tag-yellow);
  color: var(--color-bg-dark);
}

.status-badge.canceled {
  background-color: var(--color-cancel-color);
  color: white;
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
  border: none;
}

.cancel-button {
  background-color: var(--color-cancel-color);
  color: white;
}

.view-plans-button {
  background-color: var(--color-main-color);
  color: var(--color-bg-dark);
}

.cancel-button:hover {
  background-color: var(--color-cancel-hover);
}

.view-plans-button:hover {
  background-color: var(--color-main-color-hover);
}

.debug-button {
  background-color: var(--color-tag-yellow);
  color: var(--color-bg-dark);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
  border: none;
  margin-left: 1rem;
}

.debug-button:hover {
  background-color: #e6a800;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-auth-button);
  color: var(--color-text-primary);
}

.history-table th {
  font-weight: 600;
  opacity: 0.8;
}

.history-table td {
  opacity: 0.9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.modal-content p {
  color: var(--color-text-primary);
  opacity: 0.9;
  margin-bottom: 1rem;
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
  background-color: var(--color-border-auth-button);
  color: var(--color-text-primary);
}

.confirm-action {
  background-color: var(--color-cancel-color);
  color: white;
}

.cancel-action:hover {
  background-color: var(--color-auth-button-hover);
}

.confirm-action:hover {
  background-color: var(--color-cancel-hover);
}

.no-subscription {
  text-align: center;
  padding: 3rem;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.no-subscription p {
  color: var(--color-text-primary);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.subscription-policy-notice {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.subscription-policy-notice h4 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
}

.policy-item {
  margin-bottom: 1rem;
}

.policy-item:last-child {
  margin-bottom: 0;
}

.policy-item strong {
  color: #343a40;
  display: block;
  margin-bottom: 0.5rem;
}

.policy-item p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
}

.cancel-policy-info {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.cancel-policy-info h4 {
  margin: 0 0 0.75rem 0;
  color: #856404;
}

.cancel-policy-info ul {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}

.cancel-policy-info li {
  margin-bottom: 0.5rem;
  color: #856404;
}

.warning-text {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 1rem 0;
  color: #721c24;
  font-size: 0.9rem;
}

.confirmation-question {
  font-weight: 600;
  color: #495057;
  text-align: center;
  margin: 1rem 0;
}

.change-plan-button {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-right: 1rem;
}

.change-plan-button:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  color: white;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}

.cancellation-notice {
  width: 100%;
  background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
  border: 2px solid #fc8181;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.cancellation-status h3 {
  margin: 0 0 1rem 0;
  color: #c53030;
  font-size: 1.4rem;
}

.cancellation-info {
  color: #744d4d;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 1rem;
}

.remaining-time {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  border: 1px solid #fc8181;
}

.time-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.time-info:last-child {
  margin-bottom: 0;
}

.time-info .label {
  font-weight: 600;
  color: #c53030;
}

.time-info .date,
.time-info .remaining {
  font-weight: 700;
  color: #2d3748;
  background: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.resubscribe-action {
  margin-top: 1.5rem;
}

.resubscribe-button {
  background: linear-gradient(135deg, #3182ce 0%, #2c5aa0 100%);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.resubscribe-button:hover {
  background: linear-gradient(135deg, #2c5aa0 0%, #2a4a7c 100%);
  color: white;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(49, 130, 206, 0.4);
}

@media (max-width: 768px) {
  .my-subscription-container {
    padding: 1rem;
  }

  .subscription-details {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .cancel-button, .view-plans-button, .change-plan-button {
    width: 100%;
    text-align: center;
    margin-right: 0;
  }

  .subscription-policy-notice {
    padding: 1rem;
    margin-top: 1rem;
  }

  .cancel-policy-info {
    padding: 0.75rem;
  }

  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
    max-height: 90vh;
    overflow-y: auto;
  }

  .cancel-policy-info ul {
    padding-left: 1rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .modal-actions button {
    width: 100%;
  }

  .cancellation-notice {
    padding: 1.5rem;
  }

  .remaining-time {
    padding: 1rem;
  }

  .time-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .resubscribe-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    justify-content: center;
  }
}
</style> 