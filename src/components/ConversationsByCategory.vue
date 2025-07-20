<script setup lang="ts">
import { useFavoritesStore } from '../stores/useFavoritesStore'
import type { Conversation } from '../types/Conversation'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import defaultAvatar from '../assets/images/defaultAvatar.png'
import HeartEmpty from './icon/HeartEmpty.vue'
import HeartFilled from './icon/HeartFilled.vue'

const props = defineProps<{
  conversations: Conversation[]
}>()

const favoriteStore = useFavoritesStore()

const toggleFavorite = async (conversationId: number) => {
  if (favoriteStore.isFavorite(conversationId)) {
    await favoriteStore.removeFromFavorites(conversationId)
    toast.success('La conversation a bien été retiré des favoris')
  } else {
    await favoriteStore.addToFavorites(conversationId)
    toast.success('La conversation a bien été ajouté aux favoris')
  }
}
</script>

<template>
  <div
    v-for="conversation in props.conversations"
    :key="conversation.id"
    class="p-4 mb-4 bg-gray-70 text-white rounded-xl hover:bg-gray-600 transition flex items-center justify-between space-x-4"
  >
    <div class="flex items-center space-x-4">
      <img
        :src="conversation.content.interlocutor_avatar || defaultAvatar"
        alt="Avatar interlocuteur"
        class="w-12 h-12 rounded-full border-2 border-blue-400 object-cover" loading="lazy"
      />
      <div>
        <div class="font-semibold text-lg">
          {{ conversation.title || 'Aucun titre pour cette conversation' }}
        </div>
        <div class="font-semibold text-lg">
          {{ conversation.content.interlocutor_username || 'Utilisateur' }}
        </div>
      </div>
    </div>
    <div class="flex item-center space-x-2">
      <router-link
        :to="`/view-conversation/${conversation.id}`"
        class="px-3 py-1 bg-blue-500 rounded-md text-white font-medium"
        >Visualiser</router-link
      >
      <button
          type="button"
        @click.stop="toggleFavorite(conversation.id!)"
        class="ml-3 cursor-pointer"
        :title="
          favoriteStore.isFavorite(conversation.id!)
            ? 'Retirer des favoris'
            : 'Ajouter aux favoris'
        "
      >
        <HeartFilled v-if="favoriteStore.isFavorite(conversation.id!)" />
        <HeartEmpty v-else />
      </button>
    </div>
  </div>
</template>
