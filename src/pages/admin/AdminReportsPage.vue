<script setup lang="ts">
import { ref, onMounted } from 'vue'
import adminReportService, { type ReportedComment } from '../../api/adminReportService'
import AdminReportsTable from '../../components/admin/AdminReportsTable.vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useAuthStore } from '../../stores/useAuthStore'

const authStore = useAuthStore()
const comments = ref<ReportedComment[]>([])
const loading = ref(true)
const successMessage = ref('')
const errorMessage = ref('')

const loadReportedComments = async () => {
  try {
    loading.value = true
    comments.value = await adminReportService.getPendingComments()
  } catch (error) {
    errorMessage.value = 'Erreur lors du chargement des commentaires signalés'
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

const validateComment = async (commentId: number) => {
  try {
    await adminReportService.validateComment(commentId)
    successMessage.value = 'Commentaire validé avec succès'
    
    // Retirer le commentaire de la liste des signalements
    comments.value = comments.value.filter(comment => comment.id !== commentId)
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error) {
    errorMessage.value = 'Erreur lors de la validation du commentaire'
    console.error('Erreur:', error)
    
    // Effacer le message d'erreur après 3 secondes
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

const rejectComment = async (commentId: number) => {
  try {
    await adminReportService.rejectComment(commentId)
    successMessage.value = 'Commentaire supprimé avec succès'
    
    // Retirer le commentaire de la liste des signalements
    comments.value = comments.value.filter(comment => comment.id !== commentId)
    
    // Effacer le message après 3 secondes
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (error) {
    errorMessage.value = 'Erreur lors de la suppression du commentaire'
    console.error('Erreur:', error)
    
    // Effacer le message d'erreur après 3 secondes
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

onMounted(() => {
  console.log('Current user:', authStore.user);
  console.log('Is authenticated:', authStore.isAuthenticated);
  console.log('User roles:', authStore.user?.role);
  loadReportedComments()
})
</script>

<template>
  <AdminLayout>
    <div class="container mx-auto px-4 py-8">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-100 flex items-center">
          <svg class="w-8 h-8 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          Gestion des signalements
        </h1>
        <p class="text-gray-400 mt-2">
          Modérez les commentaires signalés par les utilisateurs
        </p>
      </div>

      <!-- Messages de notification -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-600 text-white rounded-lg flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ successMessage }}
      </div>
      
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-600 text-white rounded-lg flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {{ errorMessage }}
      </div>

      <!-- Actions rapides -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            @click="loadReportedComments"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ loading ? 'Chargement...' : 'Actualiser' }}
          </button>
        </div>

        <!-- Statistiques -->
        <div class="flex items-center space-x-4 text-sm">
          <div class="flex items-center text-gray-400">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Total: {{ comments.length }}
          </div>
        </div>
      </div>

      <!-- Légende -->
      <div class="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 class="text-lg font-semibold text-gray-200 mb-3">Actions disponibles</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-center">
            <div class="w-6 h-6 bg-green-600 rounded mr-3 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <div class="text-gray-200 font-medium">Valider</div>
              <div class="text-gray-400">Le commentaire reste visible et devient "validé"</div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="w-6 h-6 bg-red-600 rounded mr-3 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <div>
              <div class="text-gray-200 font-medium">Rejeter</div>
              <div class="text-gray-400">Le commentaire est masqué/supprimé définitivement</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des signalements -->
      <AdminReportsTable
        :comments="comments"
        :loading="loading"
        @validate-comment="validateComment"
        @reject-comment="rejectComment"
      />
      
    </div>
  </AdminLayout>
</template>

<style scoped>
.container {
  max-width: 1400px;
}
</style> 