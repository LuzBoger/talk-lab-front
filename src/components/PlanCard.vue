<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { Plan, Subscription } from '../api/subscriptionService'

export default defineComponent({
  name: 'PlanCard',
  props: {
    plan: {
      type: Object as () => Plan,
      required: true,
    },
    currentSubscription: {
      type: Object as () => Subscription | null,
      default: null,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['subscribe', 'changeSubscription'],
  setup(props) {
    const isPopular = computed(() => props.plan.name === 'Business')
    const hasDiscount = computed(() => props.plan.name === 'Business')

    const formatPrice = (price: string): string => {
      return Number(price).toFixed(2)
    }

    return {
      isPopular,
      hasDiscount,
      formatPrice,
    }
  },
})
</script>

<template>
  <div
    class="bg-card-bg border rounded-lg overflow-hidden shadow-lg relative flex-1 min-w-[250px] max-w-[400px] flex flex-col h-full"
  >
    <div
      v-if="isPopular"
      class="cursor-pointer bg-validate-button hover:bg-validate-button-hover text-white text-center py-2 font-semibold text-sm w-full"
    >
      LE PLUS POPULAIRE
    </div>
    <div class="p-6 flex flex-col flex-1">
      <h2 class="text-white text-3xl font-bold mb-4">
        {{ plan.name }}
      </h2>
      <p class="text-gray-300 opacity-80 mb-4 h-16 text-base leading-relaxed">
        {{ plan.description }}
      </p>

      <div class="mb-6">
        <div
          v-if="hasDiscount"
          class="text-gray-300 opacity-60 line-through text-base mb-2"
        >
          14,99 €
        </div>
        <div
          v-if="hasDiscount"
          class="cursor-pointer bg-validate-button hover:bg-validate-button-hover text-gray-900 inline-block px-3 py-1 rounded font-semibold text-sm mb-4"
        >
          ÉCONOMISEZ 80 %
        </div>
        <div class="flex items-baseline gap-1 mb-2">
          <span class="text-4xl font-bold text-white">
            {{ formatPrice(plan.price) }}
          </span>
          <span class="text-gray-300 opacity-80 text-lg"> €/mois* </span>
        </div>
        <div class="text-gray-300 opacity-60 text-xs mb-6">
          *Avec plan de 12 mois ; TVA non incluse
        </div>
      </div>

      <div v-if="!isLoggedIn">
        <button
          class="cursor-pointer bg-validate-button hover:bg-validate-button-hover text-white w-full py-3 rounded-md text-base font-semibold transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          @click="$emit('subscribe', plan.id)"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">S'abonner</span>
          <span v-else>Traitement...</span>
        </button>
        <p
          class="text-gray-100 opacity-60 text-xs text-center mt-4 mb-8 leading-snug"
        >
          Vous serez redirigé vers la page de connexion
        </p>
      </div>

      <button
        v-else-if="!currentSubscription"
        class="cursor-pointer bg-validate-button hover:bg-validate-button-hover text-white w-full py-3 rounded-md text-base font-semibold transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        @click="$emit('subscribe', plan.id)"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">S'abonner</span>
        <span v-else>Traitement...</span>
      </button>

      <button
        v-else-if="currentSubscription.plan?.id === plan.id"
        class="bg-validate-button text-white w-full py-3 rounded-md text-base font-semibold cursor-not-allowed"
        disabled
      >
        Abonnement actuel
      </button>

      <button
        v-else
        class="bg-yellow-400 hover:bg-yellow-500 cursor-pointer text-gray-900 w-full py-3 rounded-md text-base font-semibold transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        @click="$emit('changeSubscription', plan.id)"
        :disabled="isLoading"
      >
        <span v-if="!isLoading">Changer d'abonnement</span>
        <span v-else>Traitement...</span>
      </button>

      <p
        class="text-gray-100 opacity-60 text-xs text-center mt-4 mb-8 leading-snug"
      >
        Renouvellement au prix de {{ formatPrice(plan.price) }}€/mois* pour un
        an.<br />Annulez à tout instant.
      </p>

      <div class="border-t border-gray-700 pt-6 mt-auto">
        <div
          class="flex items-start gap-2 mb-4 text-white opacity-90 text-base leading-snug"
        >
          <span class="text-green-500 font-bold text-lg">✓</span>
          <span>Template illimités</span>
        </div>
        <div
          class="flex items-start gap-2 mb-4 text-white opacity-90 text-base leading-snug"
        >
          <span class="text-green-500 font-bold text-lg">✓</span>
          <span>Support prioritaire</span>
        </div>
        <div
          class="flex items-start gap-2 mb-2 text-white opacity-90 text-base leading-snug"
        >
          <span class="text-green-500 font-bold text-lg">✓</span>
          <span>Sans filigrane</span>
        </div>
      </div>
    </div>
  </div>
</template>
