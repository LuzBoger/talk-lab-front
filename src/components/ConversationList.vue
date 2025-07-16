<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import type { Conversation } from '../types/Conversation';
import { getConversationsByUser } from '../api/conversation';
import defaultAvatar from '../assets/images/defaultAvatar.png';
import Pagination from './ui/Pagination.vue';


const conversations = ref<Conversation[]>([]);
const activePopover = ref<number | null>(null);
const currentPage = ref(1);
const pagesize = 8; 

const paginated = computed(() => {
  const start = (currentPage.value - 1) * pagesize
  return conversations.value.slice(start, start + pagesize)
})

const togglePopover =(id: number) => {
  activePopover.value = id
}

const closePopover = () => {
  activePopover.value = null;
}
onMounted(async () => {
  try {
    const response = await getConversationsByUser();
    conversations.value = response;
    console.log(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
  }
});

</script>
<template>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="conversation in paginated"
        :key="conversation.id"
        class="relative bg-[#1c1c2b] p-4 rounded-2xl shadow-lg flex flex-col gap-3 text-white"
      >
        <div class="flex items-center gap-3">
          <img
            :src="conversation.content.interlocutor_avatar || defaultAvatar"
            :alt="`Avatar de ${conversation.content.interlocutor_username || 'Anonyme'}`"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="flex-1 min-w-0">
            <div class="text-lg font-bold truncate">{{ conversation.title }}</div>
            <div class="text-sm text-gray-400">@{{ conversation.content.interlocutor_username || 'Anonyme' }}</div>
          </div>
        </div>

          <p class="text-sm text-gray-300 line-clamp-4">
            {{ conversation.description || 'Pas de description.' }}
          </p>
        <button
          type="button"
          @click="togglePopover(conversation.id!)"
          class="text-blue-400 text-xs hover:underline self-start"
        >
          Lire plus
        </button>
        
        <router-link
          :to="`/conversation/${conversation.id}`"
          class="mt-auto inline-block bg-blue-600 text-white px-3 py-2 rounded text-sm z-10 relative self-start"
        >
          Voir dans le simulateur
        </router-link>

        <div
          v-if="activePopover === conversation.id"
          class="absolute inset-0 bg-black bg-opacity-80 rounded-2xl flex flex-col justify-between z-20"
        >
        <div class="relative bg-[#2a2a3d] p-6 rounded-xl max-w-sm max-h-[80vh] overflow-auto text-gray-300">
          <button @click="closePopover" class="absolute top-2 right-2 text-white text-xl hover:text-red-400">
              &times;
            </button>
            <h3 class="text-lg font-bold mb-4 truncate">{{ conversation.title }}</h3>
            <p class="whitespace-pre-wrap">{{ conversation.description || 'Pas de description.' }}</p>
        </div>
      
      </div>
      </div>
    </div>
    <Pagination 
      :modelValue="currentPage"
      :totalItems="conversations.length"
      :pageSize="pagesize"
      @update:modelValue="pagesize => currentPage = pagesize"
      />

</template>
