<template>
  <div class="users-grid">
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
                  @click="$emit('viewSubscription', user.id)"
                >
                  Détails
                </button>
                <button 
                  v-if="user.hasSubscription && user.subscriptionStatus === 'active'"
                  class="btn btn-warning"
                  @click="$emit('cancelSubscription', user)"
                >
                  Annuler
                </button>
                <button 
                  v-if="user.hasSubscription"
                  class="btn btn-danger"
                  @click="$emit('deleteSubscription', user)"
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
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  hasSubscription: boolean;
  subscriptionStatus?: string | null;
  planName?: string | null;
}

export default defineComponent({
  name: 'UsersTable',
  props: {
    users: {
      type: Array as PropType<User[]>,
      required: true,
      default: () => []
    }
  },
  emits: ['viewSubscription', 'cancelSubscription', 'deleteSubscription'],
  setup() {
    const formatStatus = (status: string) => {
      switch (status) {
        case 'active': return 'Actif';
        case 'canceled': return 'Annulé';
        case 'expired': return 'Expiré';
        default: return status;
      }
    };

    return {
      formatStatus
    };
  }
});
</script>

<style scoped>
@import '../../styles/admin.css';

.table-container {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--color-text-primary);
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-auth-button);
}

.users-table th {
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

@media (max-width: 768px) {
  .table-container {
    font-size: 0.875rem;
  }

  .users-table th,
  .users-table td {
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