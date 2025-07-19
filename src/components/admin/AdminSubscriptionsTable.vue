<template>
  <div class="subscriptions-grid">
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
                  @click="$emit('cancelSubscription', subscription)"
                >
                  Annuler
                </button>
                <button 
                  class="btn btn-danger"
                  @click="$emit('deleteSubscription', subscription)"
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

interface Plan {
  name: string;
  price: string;
}

interface Subscription {
  id: number;
  plan: Plan;
  duration: number;
  status: string;
  users?: any[];
}

export default defineComponent({
  name: 'SubscriptionsTable',
  props: {
    subscriptions: {
      type: Array as PropType<Subscription[]>,
      required: true,
      default: () => []
    }
  },
  emits: ['cancelSubscription', 'deleteSubscription'],
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

.subscriptions-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--color-text-primary);
}

.subscriptions-table th,
.subscriptions-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border-auth-button);
}

.subscriptions-table th {
  background: var(--color-sidebar-bg);
  font-weight: 600;
  color: var(--color-text-primary);
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