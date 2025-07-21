<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import subscriptionService from '../api/subscriptionService'
import stripeService from '../api/stripeService'
import { useRoute } from 'vue-router'
import type {
  Subscription,
  SubscriptionHistory,
} from '../api/subscriptionService'

export default defineComponent({
  name: 'MySubscriptionPage',
  setup() {
    const route = useRoute()
    const subscription = ref<Subscription | null>(null)
    const subscriptionHistory = ref<SubscriptionHistory[]>([])
    const loading = ref(true)
    const successMessage = ref('')
    const errorMessage = ref('')
    const showCancelModal = ref(false)

    let lastFetch = 0
    let isFetching = false
    const CACHE_DURATION = 15000

    const processPaymentSuccess = async (sessionId: string) => {
      try {
        await stripeService.processCheckoutSuccess(sessionId)
        successMessage.value =
          'Paiement traité avec succès ! Votre abonnement a été activé.'
        setTimeout(() => {
          fetchSubscriptionDetails(true)
        }, 1000)
      } catch (error) {
        errorMessage.value =
          'Paiement réussi mais erreur de traitement. Votre abonnement sera activé sous peu.'
        setTimeout(() => {
          fetchSubscriptionDetails(true)
        }, 2000)
      }
    }

    const fetchSubscriptionDetails = async (forceRefresh = false) => {
      const now = Date.now()
      if (
        !forceRefresh &&
        now - lastFetch < CACHE_DURATION &&
        subscription.value !== null
      ) {
        loading.value = false
        return
      }
      if (isFetching) {
        return
      }
      loading.value = true
      isFetching = true
      errorMessage.value = ''
      try {
        const currentSubscription =
          await subscriptionService.getCurrentSubscription()
        subscription.value = currentSubscription
        lastFetch = now
        try {
          const history = await subscriptionService.getSubscriptionHistory()
          subscriptionHistory.value = history
        } catch {
          subscriptionHistory.value = []
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          try {
            const debugResult = await stripeService.debugUserSituation()
            if (debugResult.auto_association) {
              setTimeout(() => {
                fetchSubscriptionDetails(true)
              }, 1000)
              return
            } else if (
              debugResult.stripe_subscriptions &&
              debugResult.stripe_subscriptions.length > 0
            ) {
            } else {
              subscription.value = null
            }
          } catch {
            subscription.value = null
          }
          lastFetch = now
        } else if (
          error.name === 'AxiosError' &&
          error.code === 'ECONNABORTED'
        ) {
          errorMessage.value =
            'La demande a pris trop de temps. Le serveur est temporairement surchargé. Veuillez réessayer dans quelques instants.'
        } else {
          errorMessage.value =
            'Impossible de charger les détails de votre abonnement. Veuillez réessayer.'
        }
      } finally {
        loading.value = false
        isFetching = false
      }
    }

    const confirmCancel = () => {
      showCancelModal.value = true
    }

    const cancelSubscription = async () => {
      try {
        await subscriptionService.cancelSubscription()
        if (subscription.value) {
          subscription.value.status = 'canceled'
        }
        showCancelModal.value = false
        setTimeout(() => {
          fetchSubscriptionDetails(true)
        }, 500)
      } catch (error: any) {
        if (error.name === 'AxiosError' && error.code === 'ECONNABORTED') {
          errorMessage.value =
            "La demande d'annulation a pris trop de temps. Veuillez vérifier votre abonnement et réessayer si nécessaire."
        } else {
          errorMessage.value =
            error.response?.data?.message ||
            "Une erreur est survenue lors de l'annulation. Veuillez réessayer."
        }
      }
    }

    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR')
      } catch {
        return 'N/A'
      }
    }

    const formatPrice = (price: string | number) => {
      if (!price) return '0.00'
      return Number(price).toFixed(2)
    }

    const formatStatus = (status: string) => {
      switch (status) {
        case 'active':
          return 'Actif'
        case 'expired':
          return 'Expiré'
        case 'canceled':
          return 'Résilié'
        default:
          return status || 'Inconnu'
      }
    }

    const calculateDaysLeft = (endDateString: string, status: string) => {
      if ((status !== 'active' && status !== 'canceled') || !endDateString) {
        return '0 jour(s)'
      }
      try {
        const endDate = new Date(endDateString)
        const today = new Date()
        const diffTime = endDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays > 0) {
          return status === 'canceled'
            ? `${diffDays} jour(s) d'accès restant`
            : `${diffDays} jour(s)`
        } else {
          return status === 'canceled' ? 'Accès expiré' : '0 jour(s)'
        }
      } catch {
        return '0 jour(s)'
      }
    }

    onMounted(() => {
      const success = route.query.success
      const sessionId = route.query.session_id
      if (success === 'true' && sessionId) {
        successMessage.value = 'Paiement réussi ! Traitement en cours...'
        processPaymentSuccess(sessionId as string)
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        )
      } else if (route.query.canceled === 'true') {
        errorMessage.value =
          'Paiement annulé. Vous pouvez réessayer à tout moment.'
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        )
      }
      fetchSubscriptionDetails()
    })

    return {
      subscription,
      subscriptionHistory,
      loading,
      successMessage,
      errorMessage,
      showCancelModal,
      confirmCancel,
      cancelSubscription,
      formatDate,
      formatPrice,
      formatStatus,
      calculateDaysLeft,
    }
  },
})
</script>

<template>
  <div class="max-w-3xl mx-auto p-4 md:p-8 bg-bg-dark min-h-screen text-white">
    <h1 class="mb-8 text-2xl font-bold">Mon abonnement</h1>

    <div v-if="errorMessage" class="mb-4 p-4 rounded bg-red-600">
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="text-center py-8 text-gray-100">
      <div
        class="w-10 h-10 border-4 border-gray-700 border-t-main-color rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p>Chargement...</p>
    </div>

    <template v-else>
      <div
        v-if="subscription && subscription.plan"
        class="bg-card-bg rounded-lg shadow mb-8"
      >
        <div class="px-6 py-4 rounded-t-lg border-b border-gray-700">
          <h2 class="text-lg font-semibold">
            Détails de votre abonnement actuel
          </h2>
        </div>
        <div class="px-6 py-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-base font-bold mb-2">
                {{ subscription.plan.name }}
              </h3>
              <p class="text-gray-100 opacity-70 mb-2">
                {{ subscription.plan.description }}
              </p>
              <p class="text-main-color font-semibold mb-2">
                Prix: {{ formatPrice(subscription.plan.price) }} € /mois
              </p>
              <p class="text-gray-100 mb-2">
                Durée: {{ subscription.duration }} jours
              </p>
            </div>
            <div class="text-white">
              <p class="mb-2 flex gap-2 items-center">
                <span>Statut :</span>
                <span
                  class="inline-block px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-validate-button text-white':
                      subscription.status === 'active',
                    'bg-yellow-300 text-gray-900':
                      subscription.status === 'expired',
                    'bg-red-600 text-white': subscription.status === 'canceled',
                  }"
                >
                  {{ formatStatus(subscription.status) }}
                </span>
              </p>
              <template
                v-if="subscriptionHistory && subscriptionHistory.length > 0"
              >
                <div class="space-y-2 p-4">
                  <div
                    class="flex items-center gap-2 font-medium text-gray-100"
                  >
                    <span>📅 Date de début :</span>
                    <span>{{
                      formatDate(subscriptionHistory[0].startAt)
                    }}</span>
                  </div>
                  <div
                    class="flex items-center gap-2 font-medium text-gray-100"
                  >
                    <span>⏳ Date de fin :</span>
                    <span>{{ formatDate(subscriptionHistory[0].endAt) }}</span>
                  </div>
                  <div
                    class="flex items-center gap-2 font-medium text-gray-100"
                  >
                    <span>🕒 Jours restants :</span>
                    <span class="text-yellow-400 font-bold">
                      {{
                        calculateDaysLeft(
                          subscriptionHistory[0].endAt,
                          subscription.status,
                        )
                      }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="flex flex-wrap gap-4 mt-8">
            <template v-if="subscription.status === 'active'">
              <button
                class="bg-cancel-color hover:bg-cancel-hover cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition"
                @click="confirmCancel"
              >
                Résilier mon abonnement
              </button>
            </template>
            <template v-else-if="subscription.status === 'canceled'">
              <div class="w-full bg-red-100/80 rounded-lg p-6 text-center">
                <h3 class="text-red-700 text-lg font-bold mb-2">
                  🚫 Abonnement résilié
                </h3>
                <p class="text-red-700 mb-4">
                  Votre abonnement a été résilié avec succès. Vous conservez
                  l'accès à tous les services jusqu'à la fin de votre période
                  payée.
                </p>
                <div
                  v-if="subscriptionHistory && subscriptionHistory.length > 0"
                  class="rounded p-4 mb-4"
                >
                  <div class="flex justify-between mb-2">
                    <span class="font-semibold text-red-700"
                      >🕒 Fin d'accès :</span
                    >
                    <span class="font-bold text-gray-900">{{
                      formatDate(subscriptionHistory[0].endAt)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-semibold text-red-700"
                      >⏳ Temps restant :</span
                    >
                    <span class="font-bold text-gray-900">{{
                      calculateDaysLeft(
                        subscriptionHistory[0].endAt,
                        subscription.status,
                      )
                    }}</span>
                  </div>
                </div>
                <p class="text-gray-400 font-medium">
                  Votre abonnement a été annulé.
                </p>
              </div>
            </template>
            
          </div>

          <div
            v-if="subscription.status === 'active'"
            class="bg-bg-dark/30 rounded-xl p-6 mt-8"
          >
            <h4 class="text-white font-semibold mb-4">
              ℹ️ Politique de résiliation
            </h4>
            <div>
              <strong class="block text-red-400 mb-1">❌ Résiliation :</strong>
              <p class="text-gray-300">
                En cas de résiliation, votre abonnement restera actif jusqu'à la
                fin de la période payée. Aucun remboursement n'est possible pour
                la période déjà entamée.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!subscription || !subscription.plan"
        class="text-center p-8 bg-card-bg rounded-lg shadow mb-8"
      >
        <p class="text-gray-300 mb-4">
          Vous n'avez actuellement aucun abonnement actif.
        </p>
       
      </div>

      <div
        v-if="subscriptionHistory && subscriptionHistory.length > 0"
        class="bg-card-bg rounded-lg shadow mb-8"
      >
        <div class="px-6 py-4 rounded-t-lg border-b border-gray-700">
          <h2 class="text-white text-lg font-semibold">
            Historique de mes abonnements
          </h2>
        </div>
        <div class="px-6 py-6 overflow-x-auto">
          <table class="min-w-full text-left">
            <thead>
              <tr>
                <th class="py-2 px-4 text-gray-100 font-semibold">Plan</th>
                <th class="py-2 px-4 text-gray-100 font-semibold">Début</th>
                <th class="py-2 px-4 text-gray-100 font-semibold">Fin</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in subscriptionHistory" :key="index">
                <td class="py-2 px-4 text-gray-100">
                  {{ item.subscription?.plan?.name || 'N/A' }}
                </td>
                <td class="py-2 px-4 text-gray-100">
                  {{ formatDate(item.startAt) }}
                </td>
                <td class="py-2 px-4 text-gray-100">
                  {{ formatDate(item.endAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <div
      v-if="showCancelModal"
      class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      @click="showCancelModal = false"
    >
      <div
        class="bg-card-bg p-8 min-w-[600px] rounded-lg max-w-md relative"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-white text-lg font-bold">
            ⚠️ Confirmation de résiliation d'abonnement
          </h3>
          <span
            @click="showCancelModal = false"
            class="hover:bg-black/30 p-2 rounded-lg cursor-pointer"
            >Fermer</span
          >
        </div>

        <div class="bg-yellow-100 rounded p-4 mb-4">
          <h4 class="text-yellow-800 font-semibold mb-2">
            📅 Politique de résiliation :
          </h4>
          <ul class="list-disc pl-6 text-yellow-800 mb-2">
            <li>
              Votre abonnement restera
              <strong>actif jusqu'à la fin de la période payée</strong>
            </li>
            <li v-if="subscriptionHistory && subscriptionHistory.length > 0">
              Date de fin d'accès :
              <strong>{{ formatDate(subscriptionHistory[0].endAt) }}</strong>
            </li>
            <li>Aucun renouvellement automatique ne sera effectué</li>
            <li
              v-if="
                subscriptionHistory &&
                subscriptionHistory.length > 0 &&
                subscription
              "
            >
              Vous garderez l'accès complet pendant
              {{
                calculateDaysLeft(
                  subscriptionHistory[0].endAt,
                  subscription.status,
                )
              }}
            </li>
          </ul>
          <p class="bg-red-100 rounded p-2 text-red-700 text-sm">
            ⚠️ <strong>Important :</strong> La résiliation sera effective
            immédiatement et ne pourra pas être annulée. Vous ne pourrez pas
            réactiver ce même abonnement.
          </p>
        </div>
        <p class="font-semibold text-gray-200 text-center mb-4">
          Êtes-vous sûr de vouloir procéder à la résiliation ?
        </p>
        <div class="flex flex-col gap-3">
          <button
            class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold transition cursor-pointer"
            @click="showCancelModal = false"
          >
            Non, garder mon abonnement
          </button>
          <button
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold transition cursor-pointer"
            @click="cancelSubscription"
          >
            Oui, résilier définitivement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
