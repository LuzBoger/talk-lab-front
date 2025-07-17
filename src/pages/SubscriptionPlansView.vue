<template>
  <div class="subscription-plans">
    <div class="plans-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des plans...</p>
      </div>
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      <div v-else class="plans-grid">
        <PlanCard 
          v-for="plan in plans" 
          :key="plan.id"
          :plan="plan"
          :current-subscription="currentSubscription"
          :is-logged-in="isLoggedIn"
          :is-loading="isSubscribing"
          @subscribe="subscribe"
          @change-subscription="changeSubscription"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import subscriptionService from '../api/subscriptionService';
import stripeService from '../api/stripeService';
import { useAuthStore } from '../stores/useAuthStore';
import type { Plan, Subscription } from '../api/subscriptionService';
import PlanCard from '../components/PlanCard.vue';

export default defineComponent({
  name: 'SubscriptionPlansView',
  components: {
    PlanCard
  },
  data() {
    return {
      plans: [] as Plan[],
      currentSubscription: null as Subscription | null,
      loading: true,
      error: null as string | null,
      isSubscribing: false,
      isLoggedIn: false
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        
        const authStore = useAuthStore();
        this.isLoggedIn = authStore.isAuthenticated;
        
        this.plans = await subscriptionService.getPlans();
        
        if (this.isLoggedIn) {
          try {
            this.currentSubscription = await subscriptionService.getCurrentSubscription();
          } catch (error: any) {
            if (error.response?.status !== 404) {
              console.error('Erreur lors de la récupération de l\'abonnement actuel:', error);
            }
            this.currentSubscription = null;
          }
        } else {
          this.currentSubscription = null;
        }
      } catch (error) {
        this.error = 'Impossible de charger les plans d\'abonnement. Veuillez réessayer plus tard.';
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        this.loading = false;
      }
    },
    async subscribe(planId: number) {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }

      try {
        this.isSubscribing = true;
        
        await stripeService.redirectToCheckout(planId);
        
        
      } catch (error: any) {
        console.error('Erreur lors de la souscription avec Stripe:', error);
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la redirection vers le paiement. Veuillez réessayer plus tard.';
        alert(errorMessage);
        this.isSubscribing = false;
      }
    },
    async changeSubscription(planId: number) {
      if (!confirm('Êtes-vous sûr de vouloir changer d\'abonnement ? L\'ancien abonnement sera annulé et vous serez redirigé vers le paiement.')) {
        return;
      }
      
      try {
        this.isSubscribing = true;
        
        await stripeService.redirectToCheckout(planId);
        
        
      } catch (error: any) {
        console.error('Erreur lors du changement d\'abonnement avec Stripe:', error);
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la redirection vers le paiement. Veuillez réessayer plus tard.';
        alert(errorMessage);
        this.isSubscribing = false;
      }
    }
  }
});
</script>

<style scoped>
.subscription-plans {
  padding: 2rem;
  background: var(--color-bg-dark);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plans-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.plans-grid {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  max-width: 1200px;
  flex-wrap: wrap;
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

.error {
  text-align: center;
  padding: 2rem;
  color: var(--color-cancel-color);
  background: var(--color-card-bg);
  border: 1px solid var(--color-cancel-color);
  border-radius: 8px;
}


@media (max-width: 768px) {
  .subscription-plans {
    align-items: flex-start;
    padding-top: 3rem;
  }

  .plans-container {
    align-items: flex-start;
  }

  .plans-grid {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .subscription-plans {
    padding: 1rem;
    padding-top: 2rem;
  }
}
</style> 