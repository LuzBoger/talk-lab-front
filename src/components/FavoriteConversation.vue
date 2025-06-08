<script setup lang="ts">
import {computed} from 'vue';
import { useFavoriteStore } from '../stores/useFavoritesStore';
import defaultAvatar from '../assets/images/defaultAvatar.png';
import { useConversationUtils } from '../utils/useConversationUtils';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';



const favoriteStore  = useFavoriteStore();
const {getTimeAgo} = useConversationUtils();

const favorites = computed(() => favoriteStore.favorites);
const favoritesCount = computed(() => favoriteStore.count);

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
    <div class="bg-[#12121f] min-h-screen p-4 sm:p-6 md:p-8">
        <h2 class="text-2xl font-semibold text-white mb-2">
            Mes Favoris({{ favoritesCount }})
        </h2>
    
        <div v-if="favorites.length" class="space-y-4">
            <div
                v-for="conversation in favorites"
                :key="conversation.id"
                class="flex items-center bg-[#1c1c2b] rounded-xl p-4 transition"
            >        
        
             <img :src="conversation.content.interlocutor_avatar || defaultAvatar" alt="avatar" class="w-14 h-14 rounded-full object-cover mr-4"/>

        <div class="flex-1 overflow-hidden">
          <div class="flex justify-between items-center">
            <h3 class="text-white font-semibold truncate">{{ conversation.content.interlocutor_username || 'Anonyme' }}</h3>
            <span class="text-xs text-gray-400 whitespace-nowrap">{{ getTimeAgo(conversation.createdAt!) }}</span> 
          </div>
          <p class="text-sm text-gray-400 truncate mt-1">
            {{ conversation.description || 'Aucun message récent.' }}
          </p>
        </div>

      <button
        @click.stop="toggleFavorite(conversation.id!)"
        class="ml-3"
        :title="favoriteStore.isFavorite(conversation.id!) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <svg
          v-if="favoriteStore.isFavorite(conversation.id!)"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-red-500 fill-current"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
            2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
            C13.09 3.81 14.76 3 16.5 3
            19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400 hover:text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
      </button>
            </div>
        </div>
    </div>
</template>