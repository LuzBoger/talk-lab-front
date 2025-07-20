<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref, computed } from 'vue'
import { useConversationStore } from '../../stores/useConversationStore'
import ConversationSimulatorView from '../../components/ConversationSimulatorView.vue'
import CommentList from '../../components/Comment/CommentList.vue'
import LikeModal from '../../components/like/LikeModal.vue'
import Like from '../../components/like/Like.vue'

const conversationStore = useConversationStore()
const route = useRoute()
const id = ref(parseInt(route.params.id as string))

const conversation = computed(() => conversationStore.currentConversation)

onMounted(async () => {
  await conversationStore.fetchConversationById(id.value)
})
</script>

<template>
  <div class="min-h-screen bg-bg-dark text-white">
    <div class="max-w-7xl mx-auto p-4 md:p-8">
      <div class="mb-6 md:mb-8">
        <div class="flex items-center justify-between mb-4">
          <router-link 
            to="/" 
            class="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour aux conversations
          </router-link>
        </div>
        
        <div v-if="conversation" class="bg-card-bg rounded-xl shadow-lg p-4 md:p-6">
          <h1 class="text-xl md:text-3xl font-bold text-white mb-4">
            {{ conversation.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-gray-300">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ conversation.content?.interlocutor_name || 'Anonyme' }}
            </div>
            <div v-if="conversation.categoriesId && conversation.categoriesId.length" class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="category in conversation.categoriesId" 
                  :key="category.id"
                  class="px-2 py-1 bg-main-color text-black text-xs rounded-full font-medium"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>
          </div>
          <p v-if="conversation.description" class="text-gray-300 mt-4">
            {{ conversation.description }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div>
          <div class="bg-card-bg rounded-xl shadow-lg p-4 md:p-6">
            <h2 class="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center">
              <svg class="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3 text-main-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Aperçu de la conversation
            </h2>
            <div class="flex justify-center">
              <ConversationSimulatorView />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-card-bg rounded-xl shadow-lg p-4 md:p-6">
            <h3 class="text-base md:text-lg font-semibold text-white mb-4 flex items-center">
              <svg class="w-4 md:w-5 h-4 md:h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Réactions
            </h3>
            <Like :conversation-id="id">
              <template #modal="{isModalOpen, conversationId, close}">
                <LikeModal 
                  :is-modal-open="isModalOpen" 
                  :conversation-id="conversationId" 
                  @close="close" 
                />
              </template>
            </Like>
          </div>

          <div v-if="conversation" class="bg-card-bg rounded-xl shadow-lg p-4 md:p-6">
            <h3 class="text-base md:text-lg font-semibold text-white mb-4 flex items-center">
              <svg class="w-4 md:w-5 h-4 md:h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
              </svg>
              Informations
            </h3>
            <div class="space-y-3 text-gray-300">
              <div class="flex items-center justify-between">
                <span>Messages:</span>
                <span class="text-white font-medium">
                  {{ conversation.content?.messages?.length || 0 }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span>Créé le:</span>
                <span class="text-white font-medium">
                  {{ new Date(conversation.createdAt).toLocaleDateString('fr-FR') }}
                </span>
              </div>
              <div v-if="conversation.content?.startTime" class="flex items-center justify-between">
                <span>Heure simulée:</span>
                <span class="text-white font-medium">
                  {{ conversation.content.startTime }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-card-bg rounded-xl shadow-lg p-4 md:p-6">
            <h2 class="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center">
              <svg class="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"></path>
              </svg>
              Discussion de la communauté
            </h2>
            <div class="max-h-96 overflow-y-auto custom-scrollbar">
              <CommentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
