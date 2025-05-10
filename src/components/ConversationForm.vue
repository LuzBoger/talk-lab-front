<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Conversation } from '../types/Conversation';
import type { ConversationContent } from '../types/ConversationContent';
import { sendMessage, createConversation, getConversationById, updateConversation } from '../api/conversation';
import { useMercure } from '../composables/useMercure';

const route = useRoute();
const props = defineProps<{ categories: number; conversationId?: number }>();

const conversationId = ref<number | undefined>(props.conversationId ?? parseInt(route.params.id as string));
const title = ref<string>('');
const description = ref<string | undefined>(undefined);
const categories = ref<number>(props.categories)
const categoriesSelected = ref<number>(1); 
const status = ref<'draft' | 'published'>('draft')
const isPublic = ref(true)
const messageUser = ref<string>('')
const messageInterlocutor = ref<string>('')



const content = ref<ConversationContent>({
  interlocutor_name: '',
  interlocutor_username: '',
  interlocutor_avatar: '',
  startTime: '',
  batteryLevel: 100,
  reseau: '',
  signal: 100,
  messages: []
})

const initializeMercure = () => {
  if (conversationId.value) {
    useMercure(
      conversationId.value,
      (newMessage) => {
        console.log('Nouveau message reçu:', newMessage);
        content.value.messages?.push(newMessage);
      },
    );
  }
} 



const submitForm = async () => {
  const conversationData: Conversation = {
    title: title.value,
    description: description.value,
    category_id: [categoriesSelected.value],
    creator_id: 1,
    status: status.value,
    content: content.value,
    isPublic: isPublic.value,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const response = await createConversation(conversationData);
    conversationId.value = response.id;
    console.log('Conversation créée:', response);
    initializeMercure();
  } catch (error) {
    console.error('Error creating conversation:', error);
  }
};

const sendUserMessage = async () => {

  if (!messageUser.value || !conversationId.value) return;

  const newMessage = {
    author: 'Vous',
    message: messageUser.value,
  };

  await sendMessage(conversationId.value, newMessage);
  content.value.messages?.push(newMessage);

  messageUser.value = '';
};

const sendInterlocutorMessage = async () => {

  if (!messageInterlocutor.value || !conversationId.value) return;

    const newMessage = {
    author: 'Interlocuteur',
    message: messageInterlocutor.value,
  };


  await sendMessage(conversationId.value, newMessage);
  content.value.messages?.push(newMessage);

  messageInterlocutor.value = '';
};

onMounted(async () => {
      initializeMercure();
      if(conversationId.value) {
        try {
          const repsonse = await getConversationById(conversationId.value);
          content.value = repsonse.content;
        } catch (error) {
          console.error('Error fetching conversation:', error);
        }
      }
})
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
    <form @submit.prevent="submitForm" class="w-full md:w-1/2 bg-white p-6 rounded-lg shadow space-y-4">
      <h2 class="text-xl font-semibold text-gray-800">Simulateur</h2>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-600">Titre de la conversation</label>
          <input type="text" v-model="title" class="w-full border px-3 py-2 rounded" />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-600">Description de la conversation</label>
          <textarea v-model="description" class="w-full border px-3 py-2 rounded" rows="3"></textarea>
        </div>


        <!-- Heure -->
        <div>
          <label class="text-sm font-medium text-gray-600">L'heure</label>
          <input type="datetime-local" v-model="content.startTime" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Batterie -->
        <div>
          <label class="text-sm font-medium text-gray-600">La batterie</label>
          <input type="number" v-model="content.batteryLevel" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Réseau -->
        <div>
          <label class="text-sm font-medium text-gray-600">Type de réseau</label>
          <input type="text" v-model="content.reseau" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Signal -->
        <div>
          <label class="text-sm font-medium text-gray-600">Qualité du signal</label>
          <input type="number" v-model="content.signal" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Nom de l’interlocuteur -->
        <div>
          <label class="text-sm font-medium text-gray-600">Nom de l’interlocuteur</label>
          <input type="text" v-model="content.interlocutor_name" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Pseudo de l’interlocuteur -->
        <div>
          <label class="text-sm font-medium text-gray-600">Pseudo de l’interlocuteur</label>
          <input type="text" v-model="content.interlocutor_username" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <!-- Photo de profil -->
      <div>
        <label class="text-sm font-medium text-gray-600">Photo de profil</label>
        <input type="text" class="w-full border px-3 py-2 rounded" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- message user -->
        <div>
          <label class="text-sm font-medium text-gray-600">Votre message</label>
          <textarea v-model="messageUser" rows="3" class="w-full border rounded px-3 py-2"></textarea>
          <button type="button" @click="sendUserMessage"
            class="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Envoyer
          </button>
        </div>
        <!-- message interlocuteur -->
        <div>
          <label class="text-sm font-medium text-gray-600">Son message</label>
          <textarea v-model="messageInterlocutor" rows="3" class="w-full border rounded px-3 py-2"></textarea>
          <button type="button" @click="sendInterlocutorMessage"
            class="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Envoyer
          </button>
        </div>
      </div>

      <div class="flex justify-between space-x-2">
        <button type="reset" class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Annuler les modifications</button>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Publier</button>
      </div>
    </form>

    <!-- Prévisualisation -->
    <div class="w-full md:w-1/2 bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Aperçu Instagram</h2>
      <div class="bg-gray-100 p-4 rounded space-y-2 text-sm">
        <div class="flex justify-between text-xs text-gray-500">
          <span>{{ content.startTime }}</span>
          <span>4G {{ content.batteryLevel }}%</span>
        </div>
        <div class="font-bold">{{ content.interlocutor_name }}</div>
        <div class="text-xs text-gray-400">@{{ content.interlocutor_username }}</div>
        <div v-for="(msg, index) in content.messages" :key="index" class="mt-2">
          <div
            :class="msg.author === 'Vous' ? 'bg-white text-right' : 'bg-gray-200 text-left'"
            class="p-2 rounded shadow text-gray-700"
          >
            <strong>{{ msg.author }}:</strong> {{ msg.message }}
          </div>
        </div>
        <button class="mt-4 w-full bg-gray-300 text-gray-700 px-3 py-2 rounded">Télécharger la conversation</button>
      </div>
    </div>
  </div>
</template>
