<script setup lang="ts">
import { ref, onMounted } from 'vue'
import adminService from '../../api/adminService'

const subscriptions = ref<any[]>([])
const loading = ref(true)
const errorMessage = ref('')
const selectedSubscription = ref<any | null>(null)
const showModal = ref(false)

const fetchSubscriptions = async () => {
  loading.value = true
  try {
    const response = await adminService.getSubscriptions()
    subscriptions.value = response.subscriptions
  } catch (error) {
    console.error('Erreur lors du chargement des abonnements:', error)
    errorMessage.value =
      'Une erreur est survenue lors du chargement des abonnements.'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Actif'
    case 'expired':
      return 'Expiré'
    case 'canceled':
      return 'Annulé'
    default:
      return status
  }
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-600 text-white'
    case 'expired':
      return 'bg-yellow-400 text-gray-900'
    case 'canceled':
      return 'bg-red-600 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
}

const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'Complété'
    case 'pending':
      return 'En attente'
    case 'failed':
      return 'Échoué'
    default:
      return status
  }
}

const getPaymentStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-600 text-white'
    case 'pending':
      return 'bg-yellow-400 text-gray-900'
    case 'failed':
      return 'bg-red-600 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
}

const showSubscriptionDetails = (subscription: any) => {
  selectedSubscription.value = subscription
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSubscription.value = null
}

onMounted(() => {
  fetchSubscriptions()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 min-h-screen text-gray-100">
    <h1 class="mb-8 text-2xl font-bold">Gestion des abonnements</h1>

    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-red-600 text-white text-center font-semibold"
    >
      {{ errorMessage }}
    </div>

    <div class="rounded-xl bg-card-bg shadow-lg p-0 overflow-x-auto">
      <div class="p-0">
        <table
          v-if="!loading && subscriptions.length"
          class="min-w-full divide-y divide-gray-700"
        >
          <thead class="">
            <tr>
              <th
                class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
              >
                ID
              </th>
              <th
                class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
              >
                Utilisateur
              </th>
              <th
                class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
              >
                Plan
              </th>
              <th
                class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
              >
                Statut
              </th>
              <th
                class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
              >
                Début
              </th>
              <th
                class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
              >
                Expiration
              </th>
              <th
                class="py-3 px-4 text-right text-xs font-semibold text-gray-300 uppercase"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr
              v-for="subscription in subscriptions"
              :key="subscription.id"
              class="hover:bg-gray-700/30"
            >
              <td class="py-3 px-4">{{ subscription.id }}</td>
              <td class="py-3 px-4">
                <span v-if="subscription.users && subscription.users.length">
                  {{ subscription.users[0].email }}
                </span>
                <span v-else>-</span>
              </td>
              <td class="py-3 px-4">{{ subscription.plan.name }}</td>
              <td class="py-3 px-4">
                <span
                  class="inline-block px-3 py-1 rounded-full font-semibold text-xs"
                  :class="getStatusBadgeClass(subscription.status)"
                >
                  {{ getStatusLabel(subscription.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  v-if="
                    subscription.subscriptionHistories &&
                    subscription.subscriptionHistories.length
                  "
                >
                  {{
                    formatDate(subscription.subscriptionHistories[0].startAt)
                  }}
                </span>
                <span v-else>-</span>
              </td>
              <td class="py-3 px-4">
                <span
                  v-if="
                    subscription.subscriptionHistories &&
                    subscription.subscriptionHistories.length
                  "
                >
                  {{ formatDate(subscription.subscriptionHistories[0].endAt) }}
                </span>
                <span v-else>-</span>
              </td>
              <td class="py-3 px-4 flex justify-end">
                <button
                  class="bg-publish-button hover:bg-publish-button-hover cursor-pointer text-white font-semibold rounded px-4 py-2 text-sm transition"
                  @click="showSubscriptionDetails(subscription)"
                >
                  Détails
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else-if="loading" class="text-center py-8">
          <div
            class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          ></div>
          <span class="text-gray-300">Chargement...</span>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-400">Aucun abonnement trouvé.</p>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div
      v-if="showModal && selectedSubscription"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div class="bg-card-bg rounded-xl shadow-lg w-full max-w-3xl">
        <div
          class="px-6 py-4 border-b border-gray-700 flex items-center justify-between rounded-t-xl"
        >
          <h5 class="text-lg font-bold text-gray-100">
            Détails de l'abonnement #{{ selectedSubscription.id }}
          </h5>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none"
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>
        <div class="px-6 py-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h6 class="font-semibold mb-2">Informations générales</h6>
              <table class="min-w-full text-sm">
                <tbody>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Plan
                    </th>
                    <td>{{ selectedSubscription.plan.name }}</td>
                  </tr>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Prix
                    </th>
                    <td>{{ selectedSubscription.plan.price }} €</td>
                  </tr>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Statut
                    </th>
                    <td>
                      <span
                        class="inline-block px-3 py-1 rounded-full font-semibold text-xs"
                        :class="
                          getStatusBadgeClass(selectedSubscription.status)
                        "
                      >
                        {{ getStatusLabel(selectedSubscription.status) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Durée
                    </th>
                    <td>{{ selectedSubscription.duration }} jours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h6 class="font-semibold mb-2">Utilisateur</h6>
              <table
                class="min-w-full text-sm"
                v-if="
                  selectedSubscription.users &&
                  selectedSubscription.users.length
                "
              >
                <tbody>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Nom
                    </th>
                    <td>{{ selectedSubscription.users[0].name }}</td>
                  </tr>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Email
                    </th>
                    <td>{{ selectedSubscription.users[0].email }}</td>
                  </tr>
                  <tr>
                    <th class="pr-4 py-1 text-left font-medium text-gray-300">
                      Inscription
                    </th>
                    <td>
                      {{ formatDate(selectedSubscription.users[0].createdAt) }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-else class="text-gray-400">Aucun utilisateur associé</p>
            </div>
          </div>

          <h6 class="font-semibold mb-2">Historique</h6>
          <table
            class="min-w-full text-sm mb-4"
            v-if="
              selectedSubscription.subscriptionHistories &&
              selectedSubscription.subscriptionHistories.length
            "
          >
            <thead>
              <tr>
                <th class="pr-4 py-1 text-left font-medium text-gray-300">
                  Début
                </th>
                <th class="pr-4 py-1 text-left font-medium text-gray-300">
                  Fin
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(
                  history, index
                ) in selectedSubscription.subscriptionHistories"
                :key="index"
              >
                <td>{{ formatDate(history.startAt) }}</td>
                <td>{{ formatDate(history.endAt) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-gray-400 mb-4">Aucun historique disponible</p>

          <h6 class="font-semibold mb-2">Paiements</h6>
          <table
            class="min-w-full text-sm"
            v-if="
              selectedSubscription.payments &&
              selectedSubscription.payments.length
            "
          >
            <thead>
              <tr>
                <th class="pr-4 py-1 text-left font-medium text-gray-300">
                  Date
                </th>
                <th class="pr-4 py-1 text-left font-medium text-gray-300">
                  Montant
                </th>
                <th class="pr-4 py-1 text-left font-medium text-gray-300">
                  Méthode
                </th>
                <th class="pr-4 py-1 text-left font-medium text-gray-300">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(payment, index) in selectedSubscription.payments"
                :key="index"
              >
                <td>{{ formatDate(payment.createdAt) }}</td>
                <td>{{ payment.amount }} €</td>
                <td>{{ payment.paymentMethod }}</td>
                <td>
                  <span
                    class="inline-block px-3 py-1 rounded-full font-semibold text-xs"
                    :class="getPaymentStatusBadgeClass(payment.status)"
                  >
                    {{ getPaymentStatusLabel(payment.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-gray-400">Aucun paiement enregistré</p>
        </div>
        <div
          class="px-6 py-4 border-t border-gray-700 flex justify-end rounded-b-xl"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center cursor-pointer gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-2 transition"
            @click="closeModal"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
