<script setup lang="ts">
import { type PropType } from 'vue'
import type { ReportedComment } from '../../api/adminReportService'

const props = defineProps({
  comments: {
    type: Array as PropType<ReportedComment[]>,
    required: true,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'validateComment',
  'rejectComment',
])

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const truncateContent = (content: string, maxLength: number = 120) => {
  return content.length > maxLength 
    ? content.substring(0, maxLength) + '...' 
    : content
}

const handleValidate = (commentId: number) => {
  emit('validateComment', commentId)
}

const handleReject = (commentId: number) => {
  emit('rejectComment', commentId)
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-100 flex items-center">
        <svg class="w-6 h-6 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        Commentaires signalés ({{ comments.length }})
      </h2>
      <p class="text-gray-400 text-sm mt-1">
        Gérez les commentaires signalés par les utilisateurs
      </p>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Chargement des signalements...
      </div>
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-12">
      <div class="w-20 h-20 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
        <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-300 mb-2">Aucun signalement en attente</h3>
      <p class="text-gray-500">Tous les commentaires signalés ont été traités !</p>
    </div>
    
    <div
      v-else
      class="bg-gray-800 border border-gray-700 rounded-lg shadow overflow-hidden"
    >
      <table class="min-w-full text-sm text-left text-gray-200">
        <thead>
          <tr class="bg-gray-700 border-b border-gray-600">
            <th class="px-6 py-4 font-semibold">Commentaire</th>
            <th class="px-6 py-4 font-semibold">Auteur</th>
            <th class="px-6 py-4 font-semibold">Conversation</th>
            <th class="px-6 py-4 font-semibold">Date</th>
            <th class="px-6 py-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="comment in comments"
            :key="comment.id"
            class="border-b border-gray-700 hover:bg-gray-700/30 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="max-w-md">
                <p class="text-gray-200 leading-relaxed" :title="comment.content">
                  {{ truncateContent(comment.content) }}
                </p>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {{ comment.publisher.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="font-medium text-gray-200">{{ comment.publisher.name }}</div>
                  <div class="text-gray-400 text-xs">{{ comment.publisher.email || 'Email non disponible' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div>
                <div class="font-medium text-gray-200">{{ comment.conversation?.title || 'Titre non disponible' }}</div>
                <div class="text-gray-400 text-xs">ID: {{ comment.conversationId }}</div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-400">
              {{ comment.createdAt ? formatDate(comment.createdAt) : 'Date inconnue' }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center space-x-2">
                <button
                  @click="handleValidate(comment.id!)"
                  class="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  title="Valider le commentaire (le laisser visible)"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Valider
                </button>
                <button
                  @click="handleReject(comment.id!)"
                  class="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  title="Rejeter/Supprimer le commentaire"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Rejeter
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.bg-card-bg {
  background-color: rgba(31, 41, 55, 0.8);
}
</style> 