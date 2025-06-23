<script setup lang="ts">
import {computed} from 'vue';
import { useFavoritesStore } from '../stores/useFavoritesStore';
import defaultAvatar from '../assets/images/defaultAvatar.png';
import { useConversationUtils } from '../utils/useConversationUtils';
import { toast } from 'vue3-toastify';
import HeartEmpty from './icon/HeartEmpty.vue';
import HeartFilled from './icon/HeartFilled.vue';
import 'vue3-toastify/dist/index.css';


const favoriteStore  = useFavoritesStore();
const {getTimeAgo} = useConversationUtils();

const favorites = computed(() => favoriteStore.favorites);

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
        <div v-if="favorites.length" class="space-y-4">
            <div
                v-for="conversation in favorites"
                :key="conversation.id"
                class="flex items-center bg-[#1c1c2b] rounded-xl p-4 transition"
            >        
        
             <img :src="conversation.content.interlocutor_avatar || defaultAvatar" alt="avatar" class="w-14 h-14 rounded-full object-cover mr-4"/>

        <div class="flex-1 overflow-hidden">
          <div class="flex justify-between items-center">
            <h2 class="text-white font-semibold truncate">{{ conversation.content.interlocutor_username || 'Anonyme' }}</h2>
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
        <HeartFilled v-if="favoriteStore.isFavorite(conversation.id!)" />
        <HeartEmpty v-else />
      </button>
            </div>
        </div>
</template>