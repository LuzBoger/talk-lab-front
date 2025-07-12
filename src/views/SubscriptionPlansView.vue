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
        <div v-for="plan in plans" :key="plan.id" class="plan-card">
          <div class="popular-badge" v-if="plan.name === 'Business'">
            LE PLUS POPULAIRE
          </div>
          <div class="plan-content">
            <h2>{{ plan.name }}</h2>
            <p class="plan-description">{{ plan.description }}</p>
            
            <div class="price-section">
              <div class="original-price" v-if="plan.name === 'Business'">14,99 €</div>
              <div class="discount" v-if="plan.name === 'Business'">ÉCONOMISEZ 80 %</div>
              <div class="price">
                <span class="amount">{{ formatPrice(plan.price) }}</span>
                <span class="period">€/mois*</span>
              </div>
              <div class="price-note">*Avec plan de 12 mois ; TVA non incluse</div>
            </div>

            <div v-if="!isLoggedIn">
              <button 
                class="select-button" 
                @click="subscribe(plan.id)"
                :disabled="isSubscribing"
              >
                <span v-if="!isSubscribing">S'abonner</span>
                <span v-else>Traitement...</span>
              </button>
              <p class="login-note">Vous serez redirigé vers la page de connexion</p>
            </div>

            <button 
              v-else-if="!currentSubscription"
              class="select-button" 
              @click="subscribe(plan.id)"
              :disabled="isSubscribing"
            >
              <span v-if="!isSubscribing">S'abonner</span>
              <span v-else>Traitement...</span>
            </button>

            <button 
              v-else-if="currentSubscription.plan?.id === plan.id"
              class="current-plan-button" 
              disabled
            >
              Abonnement actuel
            </button>

            <button 
              v-else
              class="change-button" 
              @click="changeSubscription(plan.id)"
              :disabled="isSubscribing"
            >
              <span v-if="!isSubscribing">Changer d'abonnement</span>
              <span v-else>Traitement...</span>
            </button>

            <p class="renewal-note">Renouvellement au prix de {{ formatPrice(plan.price) }}€/mois* pour un an.<br>Annulez à tout instant.</p>

            <div class="features">
              <div class="feature-item">
                <span class="check">✓</span>
                <span>Template illimités</span>
              </div>
              <div class="feature-item">
                <span class="check">✓</span>
                <span>Support prioritaire</span>
              </div>
              <div class="feature-item">
                <span class="check">✓</span>
                <span>Sans filigrane</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import subscriptionService from '../api/subscriptionService';
import { useAuthStore } from '../stores/useAuthStore';
import type { Plan, Subscription } from '../api/subscriptionService';

export default defineComponent({
  name: 'SubscriptionPlansView',
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
    formatPrice(price: string): string {
      return Number(price).toFixed(2);
    },
    async subscribe(planId: number) {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }

      try {
        this.isSubscribing = true;
        const result = await subscriptionService.subscribe(planId);
        
        alert(result.message || 'Abonnement créé avec succès !');
        
        this.$router.push('/my-subscription');
      } catch (error: any) {
        console.error('Erreur lors de la souscription:', error);
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de la souscription. Veuillez réessayer plus tard.';
        alert(errorMessage);
      } finally {
        this.isSubscribing = false;
      }
    },
    async changeSubscription(planId: number) {
      if (!confirm('Êtes-vous sûr de vouloir changer d\'abonnement ? L\'ancien abonnement sera annulé.')) {
        return;
      }
      
      try {
        this.isSubscribing = true;
        const result = await subscriptionService.changeSubscription(planId);
        
        alert(result.message || 'Abonnement modifié avec succès !');
        
        this.$router.push('/my-subscription');
      } catch (error: any) {
        console.error('Erreur lors du changement d\'abonnement:', error);
        const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors du changement d\'abonnement. Veuillez réessayer plus tard.';
        alert(errorMessage);
      } finally {
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
}

.plans-grid {
  max-width: 400px;
  margin: 0 auto;
}

.plan-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.popular-badge {
  background: var(--color-main-color);
  color: var(--color-bg-dark);
  text-align: center;
  padding: 0.8rem;
  font-weight: 600;
  font-size: 0.9rem;
  width: 100%;
}

.plan-content {
  padding: 2rem;
}

h2 {
  color: var(--color-text-primary);
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.plan-description {
  color: var(--color-text-primary);
  opacity: 0.8;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.price-section {
  margin-bottom: 1.5rem;
}

.original-price {
  color: var(--color-text-primary);
  opacity: 0.6;
  text-decoration: line-through;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.discount {
  background: var(--color-main-color);
  color: var(--color-bg-dark);
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.price {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}

.amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.period {
  color: var(--color-text-primary);
  opacity: 0.8;
  font-size: 1.2rem;
}

.price-note {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 0.8rem;
  margin-bottom: 1.5rem;
}

.select-button {
  background: var(--color-main-color);
  color: var(--color-bg-dark);
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.select-button:hover {
  background: var(--color-main-color-hover);
}

.select-button:disabled {
  background: var(--color-border-auth-button);
  cursor: not-allowed;
}

.current-plan-button {
  background: var(--color-validate-button);
  color: white;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: not-allowed;
}

.change-button {
  background: var(--color-tag-yellow);
  color: var(--color-bg-dark);
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.change-button:hover {
  background: #e6a800;
}

.change-button:disabled {
  background: var(--color-border-auth-button);
  cursor: not-allowed;
}

.renewal-note {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 0.8rem;
  text-align: center;
  margin: 1rem 0 2rem;
  line-height: 1.4;
}

.features {
  border-top: 1px solid var(--color-border-auth-button);
  padding-top: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  opacity: 0.9;
  font-size: 0.95rem;
  line-height: 1.4;
}

.check {
  color: var(--color-validate-button);
  font-weight: bold;
  font-size: 1.1rem;
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

.login-note {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 0.8rem;
  text-align: center;
  margin: 1rem 0 2rem;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .subscription-plans {
    padding: 1rem;
  }

  .plan-content {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .amount {
    font-size: 2rem;
  }
}
</style> 