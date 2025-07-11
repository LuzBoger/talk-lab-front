<template>
  <div class="admin-container">
    <h1 class="mb-4">Gestion des abonnements</h1>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    
    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped" v-if="!loading && subscriptions.length">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Plan</th>
                <th>Statut</th>
                <th>Début</th>
                <th>Expiration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subscription in subscriptions" :key="subscription.id">
                <td>{{ subscription.id }}</td>
                <td>
                  <span v-if="subscription.users && subscription.users.length">
                    {{ subscription.users[0].email }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>{{ subscription.plan.name }}</td>
                <td>
                  <span 
                    class="badge" 
                    :class="getStatusBadgeClass(subscription.status)"
                  >
                    {{ getStatusLabel(subscription.status) }}
                  </span>
                </td>
                <td>
                  <span v-if="subscription.subscriptionHistories && subscription.subscriptionHistories.length">
                    {{ formatDate(subscription.subscriptionHistories[0].startAt) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span v-if="subscription.subscriptionHistories && subscription.subscriptionHistories.length">
                    {{ formatDate(subscription.subscriptionHistories[0].endAt) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="showSubscriptionDetails(subscription)"
                  >
                    <i class="fas fa-eye"></i> Détails
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <p>Aucun abonnement trouvé.</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="subscriptionDetailsModal" tabindex="-1" ref="detailsModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedSubscription">
          <div class="modal-header">
            <h5 class="modal-title">Détails de l'abonnement #{{ selectedSubscription.id }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h6>Informations générales</h6>
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <th>Plan</th>
                      <td>{{ selectedSubscription.plan.name }}</td>
                    </tr>
                    <tr>
                      <th>Prix</th>
                      <td>{{ selectedSubscription.plan.price }} €</td>
                    </tr>
                    <tr>
                      <th>Statut</th>
                      <td>
                        <span 
                          class="badge" 
                          :class="getStatusBadgeClass(selectedSubscription.status)"
                        >
                          {{ getStatusLabel(selectedSubscription.status) }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Durée</th>
                      <td>{{ selectedSubscription.duration }} jours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-md-6">
                <h6>Utilisateur</h6>
                <table class="table table-sm" v-if="selectedSubscription.users && selectedSubscription.users.length">
                  <tbody>
                    <tr>
                      <th>Nom</th>
                      <td>{{ selectedSubscription.users[0].name }}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{{ selectedSubscription.users[0].email }}</td>
                    </tr>
                    <tr>
                      <th>Inscription</th>
                      <td>{{ formatDate(selectedSubscription.users[0].createdAt) }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-else class="text-muted">Aucun utilisateur associé</p>
              </div>
            </div>
            
            <h6>Historique</h6>
            <table class="table table-sm" v-if="selectedSubscription.subscriptionHistories && selectedSubscription.subscriptionHistories.length">
              <thead>
                <tr>
                  <th>Début</th>
                  <th>Fin</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(history, index) in selectedSubscription.subscriptionHistories" :key="index">
                  <td>{{ formatDate(history.startAt) }}</td>
                  <td>{{ formatDate(history.endAt) }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-muted">Aucun historique disponible</p>
            
            <h6>Paiements</h6>
            <table class="table table-sm" v-if="selectedSubscription.payments && selectedSubscription.payments.length">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Méthode</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(payment, index) in selectedSubscription.payments" :key="index">
                  <td>{{ formatDate(payment.createdAt) }}</td>
                  <td>{{ payment.amount }} €</td>
                  <td>{{ payment.paymentMethod }}</td>
                  <td>
                    <span 
                      class="badge" 
                      :class="getPaymentStatusBadgeClass(payment.status)"
                    >
                      {{ getPaymentStatusLabel(payment.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-muted">Aucun paiement enregistré</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import adminService from '../../api/adminService';

export default defineComponent({
  name: 'SubscriptionListView',
  setup() {
    const subscriptions = ref<any[]>([]);
    const loading = ref(true);
    const errorMessage = ref('');
    const selectedSubscription = ref<any | null>(null);
    const detailsModal = ref<HTMLElement | null>(null);
    let modalInstance: Modal | null = null;
    
    const fetchSubscriptions = async () => {
      loading.value = true;
      try {
        const response = await adminService.getSubscriptions();
        subscriptions.value = response.subscriptions;
      } catch (error) {
        console.error('Erreur lors du chargement des abonnements:', error);
        errorMessage.value = "Une erreur est survenue lors du chargement des abonnements.";
      } finally {
        loading.value = false;
      }
    };
    
    const formatDate = (dateString: string): string => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    };
    
    const getStatusLabel = (status: string): string => {
      switch (status) {
        case 'active': return 'Actif';
        case 'expired': return 'Expiré';
        case 'canceled': return 'Annulé';
        default: return status;
      }
    };
    
    const getStatusBadgeClass = (status: string): string => {
      switch (status) {
        case 'active': return 'bg-success';
        case 'expired': return 'bg-warning';
        case 'canceled': return 'bg-danger';
        default: return 'bg-secondary';
      }
    };
    
    const getPaymentStatusLabel = (status: string): string => {
      switch (status) {
        case 'completed': return 'Complété';
        case 'pending': return 'En attente';
        case 'failed': return 'Échoué';
        default: return status;
      }
    };
    
    const getPaymentStatusBadgeClass = (status: string): string => {
      switch (status) {
        case 'completed': return 'bg-success';
        case 'pending': return 'bg-warning';
        case 'failed': return 'bg-danger';
        default: return 'bg-secondary';
      }
    };
    
    const showSubscriptionDetails = (subscription: any) => {
      selectedSubscription.value = subscription;
      if (modalInstance) {
        modalInstance.show();
      }
    };
    
    onMounted(() => {
      fetchSubscriptions();
      
      if (detailsModal.value) {
        modalInstance = new Modal(detailsModal.value);
      }
    });
    
    return {
      subscriptions,
      loading,
      errorMessage,
      selectedSubscription,
      detailsModal,
      formatDate,
      getStatusLabel,
      getStatusBadgeClass,
      getPaymentStatusLabel,
      getPaymentStatusBadgeClass,
      showSubscriptionDetails
    };
  }
});
</script>

<style scoped>
@import '../../styles/admin.css';

/* Styles spécifiques aux badges */
.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  color: white;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.375rem;
}

.bg-success {
  background-color: var(--color-validate-button) !important;
}

.bg-warning {
  background-color: var(--color-tag-yellow) !important;
  color: var(--color-bg-dark) !important;
}

.bg-danger {
  background-color: var(--color-cancel-color) !important;
}

.bg-secondary {
  background-color: var(--color-border-auth-button) !important;
}

.table-sm th,
.table-sm td {
  padding: 0.5rem;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.text-primary {
  color: var(--color-main-color) !important;
}

.text-success {
  color: var(--color-validate-button) !important;
}

.text-info {
  color: var(--color-publish-button) !important;
}

.text-muted {
  color: rgba(227, 227, 227, 0.6) !important;
}
</style> 