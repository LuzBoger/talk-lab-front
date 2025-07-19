<script lang="ts">
import { defineComponent } from 'vue'
import subscriptionService from '../api/subscriptionService'
import stripeService from '../api/stripeService'
import { useAuthStore } from '../stores/useAuthStore'
import type { Plan, Subscription } from '../api/subscriptionService'
import PlanCard from '../components/PlanCard.vue'

export default defineComponent({
  name: 'SubscriptionPlansView',
  components: {
    PlanCard,
  },
  data() {
    return {
      plans: [] as Plan[],
      currentSubscription: null as Subscription | null,
      loading: true,
      error: null as string | null,
      isSubscribing: false,
      isLoggedIn: false,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        this.error = null

        const authStore = useAuthStore()
        this.isLoggedIn = authStore.isAuthenticated

        this.plans = await subscriptionService.getPlans()

        if (this.isLoggedIn) {
          try {
            this.currentSubscription =
              await subscriptionService.getCurrentSubscription()
          } catch (error: any) {
            if (error.response?.status !== 404) {
              console.error(
                "Erreur lors de la récupération de l'abonnement actuel:",
                error,
              )
            }
            this.currentSubscription = null
          }
        } else {
          this.currentSubscription = null
        }
      } catch (error) {
        this.error =
          "Impossible de charger les plans d'abonnement. Veuillez réessayer plus tard."
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        this.loading = false
      }
    },
    async subscribe(planId: number) {
      if (!this.isLoggedIn) {
        this.$router.push('/login')
        return
      }

      try {
        this.isSubscribing = true

        await stripeService.redirectToCheckout(planId)
      } catch (error: any) {
        console.error('Erreur lors de la souscription avec Stripe:', error)
        const errorMessage =
          error.response?.data?.message ||
          'Une erreur est survenue lors de la redirection vers le paiement. Veuillez réessayer plus tard.'
        alert(errorMessage)
        this.isSubscribing = false
      }
    },

  },
})
</script>
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-bg-dark py-8 px-4"
  >
    <div class="w-full flex flex-col items-center">
      <div v-if="loading" class="text-center py-8 text-gray-300">
        <div
          class="w-10 h-10 border-4 border-gray-700 border-t-main-color rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p>Chargement des plans...</p>
      </div>
      <div
        v-else-if="error"
        class="text-center py-8 text-red-400 bg-gray-800 border border-red-400 rounded-lg w-full max-w-xl mx-auto"
      >
        {{ error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 w-fit max-w-6xl">
        <PlanCard
          v-for="plan in plans"
          :key="plan.id"
          :plan="plan"
          :current-subscription="currentSubscription"
          :is-logged-in="isLoggedIn"
          :is-loading="isSubscribing"
          class="h-full flex"
          @subscribe="subscribe"
        />
      </div>
    </div>
  </div>
</template>
