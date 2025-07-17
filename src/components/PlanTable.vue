<template>
  <div class="card shadow">
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-striped" v-if="!loading && plans.length">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Description</th>
              <th>Abonnés actifs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plan in plans" :key="plan.id">
              <td>{{ plan.id }}</td>
              <td>{{ plan.name }}</td>
              <td>{{ formatPrice(plan.price) }} €</td>
              <td>
                <div v-html="formatDescription(plan.description)"></div>
              </td>
              <td>{{ getActiveSubscribersCount(plan) }}</td>
              <td>
                <div class="btn-group">
                  <router-link 
                    :to="`/admin/plans/${plan.id}/edit`" 
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="fas fa-edit"></i> Modifier
                  </router-link>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="$emit('delete', plan)"
                  >
                    <i class="fas fa-trash"></i> Supprimer
                  </button>
                </div>
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
          <p>Aucun plan d'abonnement trouvé.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface Subscription {
  status: string;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
  subscriptions?: Subscription[];
}

export default defineComponent({
  name: 'PlanTable',
  props: {
    plans: {
      type: Array as PropType<Plan[]>,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete'],
  setup() {
    const getActiveSubscribersCount = (plan: Plan): number => {
      if (!plan.subscriptions) return 0;
      
      return plan.subscriptions.filter(subscription => 
        subscription.status === 'active'
      ).length;
    };

    const formatPrice = (price: string): string => {
      return parseFloat(price).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const formatDescription = (description: string): string => {
      return description ? description.replace(/\n/g, '<br>') : '';
    };

    return {
      getActiveSubscribersCount,
      formatPrice,
      formatDescription
    };
  }
});
</script>

<style scoped>
@import '../styles/admin.css';
</style> 