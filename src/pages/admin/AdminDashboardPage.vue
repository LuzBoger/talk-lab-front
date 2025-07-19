<script setup lang="ts">
import { ref, onMounted } from 'vue'
import adminService from '../../api/adminService'

interface DashboardStats {
  activeSubscriptions: number
  currentMonthRevenue: number
  conversionRate: number
}

const loading = ref(true)
const successMessage = ref('')
const errorMessage = ref('')
const stats = ref<DashboardStats>({
  activeSubscriptions: 0,
  currentMonthRevenue: 0,
  conversionRate: 0,
})

const fetchStats = async () => {
  try {
    const response = await adminService.getReports()
    stats.value = response
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    errorMessage.value =
      'Impossible de charger les statistiques. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatPercent = (value: number): string => {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6 min-h-screen bg-bg-dark text-gray-100">
    <h1 class="mb-10 text-3xl font-bold text-center">
      Tableau de bord administrateur
    </h1>

    <div
      v-if="successMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-green-600 text-white text-center font-semibold"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-red-600 text-white text-center font-semibold"
    >
      {{ errorMessage }}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div
        class="rounded-xl bg-card-bg shadow-lg p-6 flex flex-col items-center"
      >
        <h5 class="mb-2 text-lg font-semibold text-gray-200">
          Abonnements actifs
        </h5>
        <h2 class="mb-2 text-4xl font-bold text-green-400">
          {{ loading ? '...' : stats.activeSubscriptions }}
        </h2>
        <p class="text-gray-400 text-sm">Nombre total d'abonnements actifs</p>
      </div>
      <div
        class="rounded-xl bg-card-bg shadow-lg p-6 flex flex-col items-center"
      >
        <h5 class="mb-2 text-lg font-semibold text-gray-200">
          Revenus du mois
        </h5>
        <h2 class="mb-2 text-4xl font-bold text-blue-400">
          {{ loading ? '...' : formatPrice(stats.currentMonthRevenue) }} €
        </h2>
        <p class="text-gray-400 text-sm">
          Total des revenus pour le mois en cours
        </p>
      </div>
      <div
        class="rounded-xl bg-card-bg shadow-lg p-6 flex flex-col items-center"
      >
        <h5 class="mb-2 text-lg font-semibold text-gray-200">
          Taux de conversion
        </h5>
        <h2 class="mb-2 text-4xl font-bold text-yellow-400">
          {{ loading ? '...' : formatPercent(stats.conversionRate) }}%
        </h2>
        <p class="text-gray-400 text-sm">
          Pourcentage d'utilisateurs avec un abonnement actif
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="rounded-xl bg-card-bg shadow-lg">
        <div class="rounded-t-xl px-6 pt-4">
          <h5 class="text-white text-lg font-bold flex items-center gap-2">
            Actions rapides
          </h5>
        </div>
        <div class="p-6">
          <div class="flex flex-col gap-4">
            <router-link
              to="/admin/plans"
              class="inline-flex items-center justify-center gap-2 bg-validate-button hover:bg-validate-button-hover text-white font-semibold rounded-lg px-6 py-3 transition"
            >
              Gérer les plans
            </router-link>
            <router-link
              to="/admin/subscriptions"
              class="inline-flex items-center justify-center gap-2 bg-publish-button hover:bg-publish-button-hover text-white font-semibold rounded-lg px-6 py-3 transition"
              >Gérer les abonnements
            </router-link>
            <router-link
              to="/admin/reports"
              class="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-3 transition"
            >
              Voir les rapports détaillés
            </router-link>
            <router-link
              to="/admin/comments"
              class="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg px-6 py-3 transition"
            >
              Gérer les commentaires
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
