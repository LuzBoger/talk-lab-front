<template>
  <div class="subscription-badge" v-if="subscription">
    <div 
      class="badge" 
      :class="{
        'badge-success': subscription.status === 'active',
        'badge-warning': subscription.status === 'expired',
        'badge-danger': subscription.status === 'canceled'
      }"
    >
      {{ subscription.plan.name }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import subscriptionService, { type Subscription } from '../api/subscriptionService';
import authService from '../api/authService';

export default defineComponent({
  name: 'SubscriptionBadge',
  setup() {
    const subscription = ref<Subscription | null>(null);
    const isLoading = ref(false);

    const fetchSubscription = async () => {
      if (!authService.isAuthenticated()) {
        subscription.value = null;
        return;
      }
      
      isLoading.value = true;
      try {
        const data = await subscriptionService.getCurrentSubscription();
        subscription.value = data.subscription;
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'abonnement:', error);
        subscription.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    watch(() => authService.isAuthenticated(), (isAuthenticated) => {
      if (isAuthenticated) {
        fetchSubscription();
      } else {
        subscription.value = null;
      }
    });

    onMounted(() => {
      fetchSubscription();
    });

    return {
      subscription,
      isLoading
    };
  }
});
</script>

<style scoped>
.subscription-badge {
  display: inline-block;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.badge-success {
  background-color: #23CE6B;
}

.badge-warning {
  background-color: #ffc107;
}

.badge-danger {
  background-color: #dc3545;
}
</style> 