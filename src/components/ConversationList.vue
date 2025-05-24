<script setup lang="ts">

import { onMounted, ref } from 'vue';
import type { Conversation } from '../types/Conversation';
import { getConversationsByUser } from '../api/conversation';
import defaultAvatar from '../assets/images/defaultAvatar.png';


const conversations = ref<Conversation[]>([]);

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
  <div class="p-6 min-h-screen bg-[#12121f]">
    <h2 class="text-2xl font-semibold mb-4 text-white">Mes Conversations</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="relative bg-[#1c1c2b] p-4 rounded-2xl shadow-lg flex flex-col gap-3 text-white group "
      >
        <div class="flex items-center gap-3">
          <img
            :src="conversation.content.interlocutor_avatar || defaultAvatar"
            :alt="`Avatar de ${conversation.content.interlocutor_username || 'Anonyme'}`"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div class="text-lg font-bold truncate">{{ conversation.title }}</div>
            <div class="text-sm text-gray-400">@{{ conversation.content.interlocutor_username || 'Anonyme' }}</div>
          </div>
        </div>
        
        <router-link
          :to="`/conversation/${conversation.id}`"
          class="inline-block bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm z-10 relative mt-auto self-start"
        >
          Voir dans le simulateur
        </router-link>
                <div
          class="absolute inset-0 bg-black bg-opacity-80 text-gray-300 p-4 rounded-2xl opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center text-center group-hover:opacity-100 group-hover:pointer-events-auto z-20"
          :title="conversation.description || 'Pas de description.'"
        >
          <p class="line-clamp-6 max-h-full overflow-auto">
            {{ conversation.description || 'Pas de description.' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
