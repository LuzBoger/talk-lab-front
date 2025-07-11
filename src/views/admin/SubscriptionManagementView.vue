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
@import '../../styles/admin.css';

/* Styles spécifiques à la gestion des abonnements */
.subscription-management {
  background-color: var(--color-bg-dark);
  color: var(--color-text-primary);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header p {
  color: var(--color-text-primary);
  font-size: 1.1rem;
  opacity: 0.8;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-main-color);
  background: transparent;
  color: var(--color-main-color);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.tab-button.active {
  background: var(--color-main-color);
  color: var(--color-bg-dark);
}

.tab-button:hover {
  background: var(--color-main-color);
  color: var(--color-bg-dark);
}

.table-container {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-x: auto;
}

.users-table,
.subscriptions-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--color-text-primary);
}

.users-table th,
.users-table td,
.subscriptions-table th,
.subscriptions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-auth-button);
}

.users-table th,
.subscriptions-table th {
  background: var(--color-sidebar-bg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.subscription-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.subscription-badge.has-subscription {
  background-color: var(--color-validate-button);
  color: white;
}

.subscription-badge.no-subscription {
  background-color: var(--color-card-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-auth-button);
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

.status-badge.canceled {
  background-color: var(--color-cancel-color);
  color: white;
}

.status-badge.expired {
  background-color: var(--color-tag-yellow);
  color: var(--color-bg-dark);
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.description {
  background: var(--color-sidebar-bg);
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-line;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-auth-button);
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