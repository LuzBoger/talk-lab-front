<template>
  <div class="plan-card">
    <div class="popular-badge" v-if="isPopular">
      LE PLUS POPULAIRE
    </div>
    <div class="plan-content">
      <h2>{{ plan.name }}</h2>
      <p class="plan-description">{{ plan.description }}</p>
      
      <div class="price-section">
        <div class="original-price" v-if="hasDiscount">14,99 €</div>
        <div class="discount" v-if="hasDiscount">ÉCONOMISEZ 80 %</div>
        <div class="price">
          <span class="amount">{{ formatPrice(plan.price) }}</span>
          <span class="period">€/mois*</span>
        </div>
        <div class="price-note">*Avec plan de 12 mois ; TVA non incluse</div>
      </div>

      <div v-if="!isLoggedIn">
        <button 
          class="select-button" 
          @click="$emit('subscribe', plan.id)"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">S'abonner</span>
          <span v-else>Traitement...</span>
        </button>
        <p class="login-note">Vous serez redirigé vers la page de connexion</p>
      </div>

      <button 
        v-else-if="!currentSubscription"
        class="select-button" 
        @click="$emit('subscribe', plan.id)"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">S'abonner</span>
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
        @click="$emit('changeSubscription', plan.id)"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">Changer d'abonnement</span>
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
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { Plan, Subscription } from '../api/subscriptionService';

export default defineComponent({
  name: 'PlanCard',
  props: {
    plan: {
      type: Object as () => Plan,
      required: true
    },
    currentSubscription: {
      type: Object as () => Subscription | null,
      default: null
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['subscribe', 'changeSubscription'],
  setup(props) {
    const isPopular = computed(() => props.plan.name === 'Business');
    const hasDiscount = computed(() => props.plan.name === 'Business');

    const formatPrice = (price: string): string => {
      return Number(price).toFixed(2);
    };

    return {
      isPopular,
      hasDiscount,
      formatPrice
    };
  }
});
</script>

<style scoped>
.plan-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  flex: 1;
  min-width: 300px;
  max-width: 350px;
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

.plan-content h2 {
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

.login-note {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 0.8rem;
  text-align: center;
  margin: 1rem 0 2rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .plan-card {
    min-width: 280px;
    max-width: 400px;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .plan-content {
    padding: 1.5rem;
  }

  .plan-content h2 {
    font-size: 1.5rem;
  }

  .amount {
    font-size: 2rem;
  }

  .plan-card {
    min-width: 250px;
  }
}
</style> 