<script setup lang="ts">
import { ref, onMounted } from 'vue'
import adminService from '../../api/adminService'
import MonthlyRevenueTable from '../../components/MonthlyRevenueTable.vue'
import PlanRevenueTable from '../../components/PlanRevenueTable.vue'

const loading = ref(true)
const errorMessage = ref('')
const reports = ref<any>({})

const fetchReports = async () => {
  loading.value = true
  try {
    const data = await adminService.getReports()
    reports.value = data
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error)
    errorMessage.value =
      'Une erreur est survenue lors du chargement des rapports.'
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
  fetchReports()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="mb-10 text-3xl font-bold text-center text-gray-100">
      Rapports d'abonnement
    </h1>

    <div
      v-if="errorMessage"
      class="mb-6 rounded-lg px-4 py-3 bg-red-600 text-white text-center font-semibold"
    >
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="flex flex-col items-center py-16">
      <span
        class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
      ></span>
      <p class="text-gray-300">Chargement...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div
          class="bg-card-bg rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition h-full"
        >
          <div class="p-6 text-center">
            <h4 class="mb-3 text-lg font-semibold text-gray-100">
              Abonnements actifs
            </h4>
            <div class="text-4xl font-bold text-green-500 mb-3">
              {{ reports.activeSubscriptions || 0 }}
            </div>
            <p class="text-gray-400">Nombre total d'abonnements actifs</p>
          </div>
        </div>
       
        <div
          class="bg-card-bg rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-2xl transition h-full"
        >
          <div class="p-6 text-center">
            <h4 class="mb-3 text-lg font-semibold text-gray-100">
              Taux de conversion
            </h4>
            <div class="text-4xl font-bold text-blue-400 mb-3">
              {{ formatPercent(reports.conversionRate || 0) }}%
            </div>
            <p class="text-gray-400">
              Pourcentage d'utilisateurs avec un abonnement actif
            </p>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-6"
        v-if="
          (reports.monthlyStats && reports.monthlyStats.length) ||
          (reports.planRevenue && reports.planRevenue.length)
        "
      >
        <div
          class="lg:col-span-2"
          v-if="reports.monthlyStats && reports.monthlyStats.length"
        >
          <MonthlyRevenueTable :monthlyStats="reports.monthlyStats" />
        </div>
        <div v-if="reports.planRevenue && reports.planRevenue.length">
          <PlanRevenueTable :planRevenue="reports.planRevenue" />
        </div>
      </div>
    </div>
  </div>
</template>
