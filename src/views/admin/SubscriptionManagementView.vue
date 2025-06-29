<template>
  <div class="subscription-management">
    <div class="header">
      <h1>Gestion des Abonnements</h1>
      <p>Gérez les abonnements de tous les utilisateurs</p>
    </div>

    <div class="tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'users' }"
        @click="activeTab = 'users'"
      >
        Utilisateurs
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'subscriptions' }"
        @click="activeTab = 'subscriptions'"
      >
        Abonnements
      </button>
    </div>

    <div class="message success" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="message error" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div v-if="activeTab === 'users'" class="tab-content">
      <div v-if="loadingUsers" class="loading">
        <div class="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
      
      <div v-else class="users-grid">
        <div class="users-header">
          <h2>Liste des Utilisateurs ({{ users.length }})</h2>
        </div>
        
        <div class="table-container">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Abonnement</th>
                <th>Statut</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span 
                    class="subscription-badge"
                    :class="{ 'has-subscription': user.hasSubscription, 'no-subscription': !user.hasSubscription }"
                  >
                    {{ user.hasSubscription ? 'Oui' : 'Non' }}
                  </span>
                </td>
                <td>
                  <span 
                    v-if="user.subscriptionStatus"
                    class="status-badge"
                    :class="user.subscriptionStatus"
                  >
                    {{ formatStatus(user.subscriptionStatus) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td>{{ user.planName || '-' }}</td>
                <td>
                  <div class="actions">
                    <button 
                      v-if="user.hasSubscription"
                      class="btn btn-info"
                      @click="viewUserSubscription(user.id)"
                    >
                      Détails
                    </button>
                    <button 
                      v-if="user.hasSubscription && user.subscriptionStatus === 'active'"
                      class="btn btn-warning"
                      @click="confirmCancelUserSubscription(user)"
                    >
                      Annuler
                    </button>
                    <button 
                      v-if="user.hasSubscription"
                      class="btn btn-danger"
                      @click="confirmDeleteUserSubscription(user)"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'subscriptions'" class="tab-content">
      <div v-if="loadingSubscriptions" class="loading">
        <div class="spinner"></div>
        <p>Chargement des abonnements...</p>
      </div>
      
      <div v-else class="subscriptions-grid">
        <div class="subscriptions-header">
          <h2>Tous les Abonnements ({{ subscriptions.length }})</h2>
        </div>
        
        <div class="table-container">
          <table class="subscriptions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan</th>
                <th>Prix</th>
                <th>Durée</th>
                <th>Statut</th>
                <th>Utilisateurs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subscription in subscriptions" :key="subscription.id">
                <td>{{ subscription.id }}</td>
                <td>{{ subscription.plan.name }}</td>
                <td>{{ subscription.plan.price }}€</td>
                <td>{{ subscription.duration }} jours</td>
                <td>
                  <span 
                    class="status-badge"
                    :class="subscription.status"
                  >
                    {{ formatStatus(subscription.status) }}
                  </span>
                </td>
                <td>{{ subscription.users?.length || 0 }}</td>
                <td>
                  <div class="actions">
                    <button 
                      v-if="subscription.status === 'active'"
                      class="btn btn-warning"
                      @click="confirmCancelSubscription(subscription)"
                    >
                      Annuler
                    </button>
                    <button 
                      class="btn btn-danger"
                      @click="confirmDeleteSubscription(subscription)"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showUserSubscriptionModal" class="modal-overlay" @click="showUserSubscriptionModal = false">
      <div class="modal-content" @click.stop>
        <h3>Détails de l'abonnement</h3>
        <div v-if="selectedUserSubscription" class="subscription-details">
          <p><strong>Utilisateur:</strong> {{ selectedUserSubscription.user.name }} ({{ selectedUserSubscription.user.email }})</p>
          <p><strong>Plan:</strong> {{ selectedUserSubscription.plan.name }}</p>
          <p><strong>Prix:</strong> {{ selectedUserSubscription.plan.price }}€/mois</p>
          <p><strong>Durée:</strong> {{ selectedUserSubscription.duration }} jours</p>
          <p><strong>Statut:</strong> 
            <span class="status-badge" :class="selectedUserSubscription.status">
              {{ formatStatus(selectedUserSubscription.status) }}
            </span>
          </p>
          <p><strong>Description:</strong></p>
          <div class="description">{{ selectedUserSubscription.plan.description }}</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showUserSubscriptionModal = false">Fermer</button>
        </div>
      </div>
    </div>

    <div v-if="showConfirmModal" class="modal-overlay" @click="showConfirmModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ confirmAction?.title }}</h3>
        <p>{{ confirmAction?.message }}</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showConfirmModal = false">Annuler</button>
          <button class="btn btn-danger" @click="executeAction">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import adminSubscriptionService from '../../api/adminSubscriptionService';
import type { User, Subscription, UserSubscription } from '../../api/adminSubscriptionService';

export default defineComponent({
  name: 'SubscriptionManagementView',
  setup() {
    const activeTab = ref('users');
    const users = ref<User[]>([]);
    const subscriptions = ref<Subscription[]>([]);
    const loadingUsers = ref(false);
    const loadingSubscriptions = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    
    const showUserSubscriptionModal = ref(false);
    const selectedUserSubscription = ref<UserSubscription | null>(null);
    
    const showConfirmModal = ref(false);
    const confirmAction = ref<{
      title: string;
      message: string;
      action: () => Promise<void>;
    } | null>(null);

    const loadUsers = async () => {
      try {
        loadingUsers.value = true;
        users.value = await adminSubscriptionService.getUsers();
      } catch (error) {
        errorMessage.value = 'Erreur lors du chargement des utilisateurs';
        console.error('Erreur:', error);
      } finally {
        loadingUsers.value = false;
      }
    };

    const loadSubscriptions = async () => {
      try {
        loadingSubscriptions.value = true;
        subscriptions.value = await adminSubscriptionService.getSubscriptions();
      } catch (error) {
        errorMessage.value = 'Erreur lors du chargement des abonnements';
        console.error('Erreur:', error);
      } finally {
        loadingSubscriptions.value = false;
      }
    };

    const viewUserSubscription = async (userId: number) => {
      try {
        selectedUserSubscription.value = await adminSubscriptionService.getUserSubscription(userId);
        showUserSubscriptionModal.value = true;
      } catch (error) {
        errorMessage.value = 'Erreur lors du chargement des détails de l\'abonnement';
        console.error('Erreur:', error);
      }
    };

    const confirmCancelUserSubscription = (user: User) => {
      confirmAction.value = {
        title: 'Annuler l\'abonnement',
        message: `Êtes-vous sûr de vouloir annuler l'abonnement de ${user.name} (${user.email}) ?`,
        action: () => cancelUserSubscription(user)
      };
      showConfirmModal.value = true;
    };

    const confirmDeleteUserSubscription = (user: User) => {
      confirmAction.value = {
        title: 'Supprimer l\'abonnement',
        message: `Êtes-vous sûr de vouloir supprimer définitivement l'abonnement de ${user.name} (${user.email}) ? Cette action est irréversible.`,
        action: () => deleteUserSubscription(user)
      };
      showConfirmModal.value = true;
    };

    const confirmCancelSubscription = (subscription: Subscription) => {
      confirmAction.value = {
        title: 'Annuler l\'abonnement',
        message: `Êtes-vous sûr de vouloir annuler l'abonnement ${subscription.plan.name} (ID: ${subscription.id}) ?`,
        action: () => cancelSubscription(subscription.id)
      };
      showConfirmModal.value = true;
    };

    const confirmDeleteSubscription = (subscription: Subscription) => {
      confirmAction.value = {
        title: 'Supprimer l\'abonnement',
        message: `Êtes-vous sûr de vouloir supprimer définitivement l'abonnement ${subscription.plan.name} (ID: ${subscription.id}) ? Cette action est irréversible.`,
        action: () => deleteSubscription(subscription.id)
      };
      showConfirmModal.value = true;
    };

    const cancelUserSubscription = async (user: User) => {
      try {
        successMessage.value = '';
        errorMessage.value = '';
        
        const userSubscription = await adminSubscriptionService.getUserSubscription(user.id);
        await adminSubscriptionService.cancelSubscription(userSubscription.id);
        successMessage.value = `Abonnement de ${user.name} annulé avec succès`;
        await loadUsers();
        await loadSubscriptions();
      } catch (error: any) {
        errorMessage.value = error.message || 'Erreur lors de l\'annulation de l\'abonnement';
        console.error('Erreur:', error);
      }
    };

    const deleteUserSubscription = async (user: User) => {
      try {
        successMessage.value = '';
        errorMessage.value = '';
        
        const userSubscription = await adminSubscriptionService.getUserSubscription(user.id);
        await adminSubscriptionService.deleteSubscription(userSubscription.id);
        successMessage.value = `Abonnement de ${user.name} supprimé avec succès`;
        await loadUsers();
        await loadSubscriptions();
      } catch (error: any) {
        errorMessage.value = error.message || 'Erreur lors de la suppression de l\'abonnement';
        console.error('Erreur:', error);
      }
    };

    const cancelSubscription = async (subscriptionId: number) => {
      try {
        successMessage.value = '';
        errorMessage.value = '';
        
        await adminSubscriptionService.cancelSubscription(subscriptionId);
        successMessage.value = 'Abonnement annulé avec succès';
        await loadUsers();
        await loadSubscriptions();
      } catch (error: any) {
        errorMessage.value = error.message || 'Erreur lors de l\'annulation de l\'abonnement';
        console.error('Erreur:', error);
      }
    };

    const deleteSubscription = async (subscriptionId: number) => {
      try {
        successMessage.value = '';
        errorMessage.value = '';
        
        await adminSubscriptionService.deleteSubscription(subscriptionId);
        successMessage.value = 'Abonnement supprimé avec succès';
        await loadUsers();
        await loadSubscriptions();
      } catch (error: any) {
        errorMessage.value = error.message || 'Erreur lors de la suppression de l\'abonnement';
        console.error('Erreur:', error);
      }
    };

    const executeAction = async () => {
      if (confirmAction.value && confirmAction.value.action) {
        await confirmAction.value.action();
        showConfirmModal.value = false;
        confirmAction.value = null;
        
        if (successMessage.value) {
          setTimeout(() => {
            successMessage.value = '';
          }, 5000);
        }
      }
    };

    const formatStatus = (status: string) => {
      switch (status) {
        case 'active': return 'Actif';
        case 'canceled': return 'Annulé';
        case 'expired': return 'Expiré';
        default: return status;
      }
    };

    onMounted(() => {
      loadUsers();
      loadSubscriptions();
    });

    return {
      activeTab,
      users,
      subscriptions,
      loadingUsers,
      loadingSubscriptions,
      successMessage,
      errorMessage,
      showUserSubscriptionModal,
      selectedUserSubscription,
      showConfirmModal,
      confirmAction,
      viewUserSubscription,
      confirmCancelUserSubscription,
      confirmDeleteUserSubscription,
      confirmCancelSubscription,
      confirmDeleteSubscription,
      executeAction,
      formatStatus
    };
  }
});
</script>

<style scoped>
.subscription-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #1A192C;
  margin-bottom: 0.5rem;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #7C3AED;
  background: white;
  color: #7C3AED;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.tab-button.active {
  background: #7C3AED;
  color: white;
}

.tab-button:hover {
  background: #6D28D9;
  color: white;
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

.users-header,
.subscriptions-header {
  margin-bottom: 1rem;
}

.users-header h2,
.subscriptions-header h2 {
  color: #1A192C;
  font-size: 1.5rem;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.users-table,
.subscriptions-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td,
.subscriptions-table th,
.subscriptions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.users-table th,
.subscriptions-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #4B5563;
}

.subscription-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.subscription-badge.has-subscription {
  background-color: #DEF7EC;
  color: #03543F;
}

.subscription-badge.no-subscription {
  background-color: #F3F4F6;
  color: #6B7280;
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

.status-badge.canceled {
  background-color: #FDE8E8;
  color: #9B1C1C;
}

.status-badge.expired {
  background-color: #FEF3C7;
  color: #92400E;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-info {
  background: #3B82F6;
  color: white;
}

.btn-info:hover {
  background: #2563EB;
}

.btn-warning {
  background: #F59E0B;
  color: white;
}

.btn-warning:hover {
  background: #D97706;
}

.btn-danger {
  background: #DC2626;
  color: white;
}

.btn-danger:hover {
  background: #B91C1C;
}

.btn-secondary {
  background: #6B7280;
  color: white;
}

.btn-secondary:hover {
  background: #4B5563;
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
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1A192C;
}

.subscription-details {
  margin-bottom: 2rem;
}

.subscription-details p {
  margin-bottom: 0.5rem;
}

.description {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-line;
  font-size: 0.9rem;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 768px) {
  .subscription-management {
    padding: 1rem;
  }

  .tabs {
    flex-direction: column;
    align-items: center;
  }

  .tab-button {
    width: 100%;
    max-width: 300px;
  }

  .table-container {
    font-size: 0.875rem;
  }

  .users-table th,
  .users-table td,
  .subscriptions-table th,
  .subscriptions-table td {
    padding: 0.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style> 