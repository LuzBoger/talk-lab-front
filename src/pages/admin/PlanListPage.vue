<script setup lang="ts">
import { ref, onMounted } from 'vue'
import adminService from '../../api/adminService'
import PlanTable from '../../components/PlanTable.vue'

interface Subscription {
  status: string
}

interface Plan {
  id: number
  name: string
  price: string
  description: string
  subscriptions?: Subscription[]
}

const plans = ref<Plan[]>([])
const loading = ref(true)
const successMessage = ref('')
const errorMessage = ref('')
const selectedPlan = ref<Plan | null>(null)
const isDeleting = ref(false)
const showModal = ref(false)

const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await adminService.getPlans()
    plans.value = response.plans
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue lors du chargement des plans.'
    console.error('Erreur lors du chargement des plans:', error)
  } finally {
    loading.value = false
  }
}

const confirmDeletePlan = (plan: Plan) => {
  selectedPlan.value = plan
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedPlan.value = null
}

const deletePlan = async () => {
  if (!selectedPlan.value) return

  isDeleting.value = true
  try {
    await adminService.deletePlan(selectedPlan.value.id)
    successMessage.value = `Le plan "${selectedPlan.value.name}" a été supprimé avec succès.`
    closeModal()
    fetchPlans()
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      'Une erreur est survenue lors de la suppression du plan.'
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 min-h-screen bg-bg-dark text-gray-100">
    <h1 class="mb-8 text-2xl font-bold">Gestion des plans d'abonnement</h1>

    <div class="flex justify-end mb-6">
      <router-link
        to="/admin/plans/new"
        class="inline-flex items-center bg-validate-button hover:bg-validate-button-hover text-white font-semibold rounded-lg px-4 py-3 transition"
      >
        Nouveau plan
      </router-link>
    </div>

    <div
      v-if="successMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-main-color text-white text-center font-semibold"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-cancel-color text-white text-center font-semibold"
    >
      {{ errorMessage }}
    </div>

    <PlanTable :plans="plans" :loading="loading" @delete="confirmDeletePlan" />

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div class="bg-card-bg rounded-xl shadow-lg w-full max-w-md">
        <div
          class="px-6 py-4 border-b border-gray-700 flex items-center justify-between rounded-t-xl"
        >
          <h5 class="text-lg font-bold text-gray-100">
            Confirmation de suppression
          </h5>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none"
            aria-label="Fermer"
          >
            &times;
          </button>
        </div>
        <div class="px-6 py-6" v-if="selectedPlan">
          <p>
            Êtes-vous sûr de vouloir supprimer le plan
            <strong>{{ selectedPlan.name }}</strong> ?
          </p>
          <p class="text-red-400 mt-2">Cette action est irréversible.</p>
        </div>
        <div
          class="px-6 py-4 border-t border-gray-700 flex justify-end gap-3 rounded-b-xl"
        >
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-2 transition"
            @click="closeModal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-6 py-2 transition disabled:opacity-60"
            @click="deletePlan"
            :disabled="isDeleting"
          >
            <span
              v-if="isDeleting"
              class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
            ></span>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
