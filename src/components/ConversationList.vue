<script setup lang="ts">

import { onMounted, ref } from 'vue';
import type { Conversation } from '../types/Conversation';
import { getConversations } from '../api/conversation';

const conversations = ref<Conversation[]>([]);

onMounted(async () => {
  try {
    const response = await getConversations();
    conversations.value = response;
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
  }
});

</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2>Creer une nouvelle conversation</h2>
            <router-link
          :to="`/conversation/create`"
          class="inline-block bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm z-50 relative"
        >
            Creer une conversation    
            </router-link>
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Toutes les Conversations</h2>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
      >
        <h2 class="text-lg font-bold text-gray-700 mb-2">{{ conversation.title }}</h2>
        <p class="text-sm text-gray-500 mb-4">
          {{ conversation.description || 'Pas de description.' }}
        </p>
        <router-link
          :to="`/conversation/${conversation.id}`"
          class="inline-block bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm z-50 relative"
        >
          Voir dans le simulateur
        </router-link>
      </div>
    </div>
  </div>
</template>