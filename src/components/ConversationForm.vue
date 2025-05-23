<script setup lang="ts">

import { onMounted, ref, watch} from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave} from 'vue-router';
import {useForm, useField} from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { conversationSchema } from '../validation/conversationSchema';
import type { Messages } from '../types/Messages';
import {getConversationById } from '../api/conversation';
import { useMessages } from '../composables/useMessages';
import { useConversation } from '../composables/useConversation';
import { useConversationUtils } from '../utils/useConversationUtils';
import PublishConversationPopUp from './PublishConversationPopUp.vue';
import defaultAvatar from '../assets/images/defaultAvatar.png';
import EmojiPicker from 'vue3-emoji-picker';
import SaveConversationPopUp from './SaveConversationPopUp.vue';


const route = useRoute();
const router = useRouter();
const props = defineProps<{ categories: number; conversationId?: number }>();

const conversationId = ref<number | null>(props.conversationId ?? parseInt(route.params.id as string));
const messageUser = ref<string>('')
const messageInterlocutor = ref<string>('')
const target = ref<'user' | 'interlocutor'>('user')
const targetIndex = ref<number | null>(null)
const showEmojiPicker = ref(false)
const showPublishModal = ref(false)
const showSaveModal = ref(false)
const isDropdownOpen = ref(false)
const isConversationModified = ref(false)
const initialvalues = ref(null)
let nextRoute: any = null


const { handleSubmit, errors, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(conversationSchema),
  
  initialValues: {
  title: '',
  description: '',
  categoriesId: [1],
  creatorId: 1,
  status: 'draft',
  isPublic: true,
  content: {
    interlocutor_name: '',
    interlocutor_username: '',
    interlocutor_avatar: '',
    startTime: '',
    batteryLevel: 0,
    reseau: '',
    signal: 0,
    messages: [],
  }
  }
});

const { value: title } = useField<string>('title');
const { value: description } = useField<string>('description');
const { value: startTime } = useField<string>('content.startTime');
const { value: batteryLevel } = useField<number>('content.batteryLevel');
const { value: reseau } = useField<string>('content.reseau');
const { value: signal } = useField<number>('content.signal');
const { value: interlocutor_name } = useField<string>('content.interlocutor_name');
const { value: interlocutor_username } = useField<string>('content.interlocutor_username');
const { value: interlocutor_avatar } = useField<string>('content.interlocutor_avatar');
const { value: messagesUsers} = useField<Messages[]>('content.messages');

const { getCurrentTime } = useConversationUtils();
const { messages, sendMessage } = useMessages(messagesUsers, setFieldValue, getCurrentTime)
const {
        status,
      isPublic,
      categoriesSelected,
      createFakeConversation,
      saveConversationChanges,
      publishConversationToPublic,
      deleteFakeConversation
} = useConversation(conversationId, values, setFieldValue);




const sendUserMessage = async () => {
  if(!messageUser.value) return;
  
  await sendMessage('user', messageUser.value)
  messageUser.value = '';
}

const sendInterlocutorMessage = async () => {
  if(!messageInterlocutor.value) return;
  
  await sendMessage('interlocutor', messageInterlocutor.value)
  messageInterlocutor.value = '';
}

const submitForm = handleSubmit(async (formValues) => {
  await createFakeConversation(formValues);
})

const saveChanges = async () => {
  await saveConversationChanges();
  isConversationModified.value = false
  showSaveModal.value = false

  if(nextRoute) {
    await router.push(nextRoute)
  }
}

const cancelSave = () => {
  showSaveModal.value = false
}


const publishConversation = async () => {
  if(!conversationId) {return}
  await publishConversationToPublic();
  showPublishModal.value = false
  isConversationModified.value = false
}

const cancelPublish = () => {
  showPublishModal.value = false
}

const deleteConversaiton = async () => {
  await deleteFakeConversation()
  router.push('/')

}

const addEmoji = (index: number, reactions: string) => {
  const updatedMessages = [...(messages.value || [])]

  if (updatedMessages[index]) {
    updatedMessages[index].reaction = reactions
    setFieldValue('content.messages', updatedMessages);
  }
}

const emojiSelected = (event: any) => {
  const emoji = event.i
  
  if( targetIndex.value !== null) {
    addEmoji(targetIndex.value, emoji)
   } else {
      if (target.value === 'user') {
        messageUser.value += emoji
      } else {
        messageInterlocutor.value += emoji;
      }
    }
  showEmojiPicker.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const openSaveModal = () => {
  showSaveModal.value = true;
  isDropdownOpen.value = false;
};

const openPublishModal = () => {
  showPublishModal.value = true;
  isDropdownOpen.value = false;
};

onBeforeRouteLeave((to, from, next) => {
  if (isConversationModified.value) {
    nextRoute = to
    showSaveModal.value = true
    next(false)
  } else {
    next()
  }
})

watch(values, (newVal) => {
  if(!initialvalues.value) { return}
  const isModified = JSON.stringify(newVal) !== JSON.stringify(initialvalues.value)
  isConversationModified.value = isModified
}, {deep: true})


onMounted(async () => {
  console.log('errors:', errors.value);
  if (conversationId.value) {
    try {
      const response = await getConversationById(conversationId.value);
      setFieldValue('title', response.title);
      setFieldValue('description', response.description);
      setFieldValue('content', response.content);
      status.value = response.status;
      isPublic.value = response.isPublic;
      initialvalues.value = JSON.parse(JSON.stringify(values))
      isConversationModified.value = false;
      console.log('Conversation récupérée:', response);
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
          <input type="datetime-local" v-model="startTime" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Batterie -->
        <div>
          <label class="text-sm font-medium text-gray-600">La batterie</label>
          <input type="number" v-model="batteryLevel" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Réseau -->
        <div>
          <label class="text-sm font-medium text-gray-600">Type de réseau</label>
          <input type="text" v-model="reseau" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Signal -->
        <div>
          <label class="text-sm font-medium text-gray-600">Qualité du signal</label>
          <input type="number" v-model="signal" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Nom de l’interlocuteur -->
        <div>
          <label class="text-sm font-medium text-gray-600">Nom de l’interlocuteur</label>
          <input type="text" v-model="interlocutor_name" class="w-full border px-3 py-2 rounded" />
        </div>
        <!-- Pseudo de l’interlocuteur -->
        <div>
          <label class="text-sm font-medium text-gray-600">Pseudo de l’interlocuteur</label>
          <input type="text" v-model="interlocutor_username" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <!-- Photo de profil -->
      <div>
        <label class="text-sm font-medium text-gray-600">Photo de profil</label>
        <input type="text" v-model="interlocutor_avatar" class="w-full border px-3 py-2 rounded" />
      </div>

        <!-- message user -->
      <div class="grid grid-cols-2 gap-4">
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

        <button 
          v-if="conversationId"
          type="button" 
          @click="deleteConversaiton"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Supprimer la conversation
        </button>

        <button 
          v-if="!conversationId"
          type="submit" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Créer la conversation
        </button>


      <div v-else-if="status === 'draft'" class="relative inline-block text-left">
        <button 
          type="button"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
          @click="toggleDropdown">
            Plus d'options
          <div 
            class="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white transition-transform duration-200"
            :class="{ 'rotate-180': isDropdownOpen }"
          ></div>
        </button>
        
        <div 
          class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden transition-all duration-200"
          :class="isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'">
          <button 
            type="button"
            @click="openSaveModal" 
            class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Enregistrer les modifications
          </button>
          <button 
            type="button"
            @click="openPublishModal" 
            class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Publier la conversation
          </button>
        </div>
      </div>
            <button
              v-else-if="status === 'published'"
              type="button"
              @click="saveChanges"
              class="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enregistrer les modifications
            </button>

     
      </div>
    </form>

    <!-- Prévisualisation -->
    <div class="w-full md:w-1/2 bg-white rounded-lg shadow p-4 flex flex-col h-full">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Instagram</h2>
      
      <div class="bg-gray-100 p-4 rounded space-y-2 text-sm">
        <div class="flex justify-between item-center text-xs text-gray-500 border-b pb-2 mb-4">
          <span>{{ startTime }}</span>
          <div class="flex items-center gap-1">
            <div class="w-16 h-2 rounded bg-gray-300 relative overflow-hidden">
            <div class="h-full rounded transition-all" :class="{
              'bg-red-500': batteryLevel <= 20,
              'bg-yellow-400': batteryLevel > 20 && batteryLevel <= 50,
              'bg-green-500': batteryLevel > 50
            }" 
            :style="{ width: Math.max(0, Math.min(batteryLevel, 100)) + '%' }"></div>
            </div>   
             <span class="text-xs text-gray-500">{{ batteryLevel }}%</span>
                   <span>{{ reseau }} </span>
            </div>
        </div>

        <div class="flex items-center gap-3 mb-4">
          <img :src="interlocutor_avatar || defaultAvatar" alt="Avatar" class="w-8 h-8 rounded-full">
          <div class="font-semibold text-sm">{{ interlocutor_name }}</div>
          <div class="text-xs text-gray-400">@{{interlocutor_username }}</div>
        </div>
        <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
        <div v-for="(msg, index) in messages" :key="index" class="mt-2">
          <div :class="[msg.author === 'user' ? 'bg-white text-right self-end' : 'bg-gray-200 text-left self-start']"
            class="p-2 rounded shadow text-gray-700">

             <div>{{ msg.message }}</div>
              <div v-if="msg.reaction" class="text-xs mt-1">Réaction : {{ msg.reaction }}</div>

          </div>
          <div v-if="msg.author === 'user' && msg.isSeen" class="text-xs text-gray-400 mt-1 text-right">
            <span class="text-black-500">Vu</span>
          </div>
        </div>
        </div>
        
        <button class="mt-4 w-full bg-gray-300 text-gray-700 px-3 py-2 rounded">Télécharger la conversation</button>
        <button @click="showEmojiPicker = !showEmojiPicker" class="text-xs text-blue-600 mt-2">Ajouter un emoji</button>

        <div v-if="showEmojiPicker" class="mt-2">
          <div class="flex gap-4 mt-2 text-sm">
            <label><input type="radio" v-model="target" value="user" /> Pour moi</label>
            <label><input type="radio" v-model="target" value="interlocutor" /> Pour l’interlocuteur</label>
          </div>
          <EmojiPicker @select="emojiSelected" />
          
        </div>
      </div>
    </div>
    <PublishConversationPopUp
      :is-visible="showPublishModal"
      @confirm="publishConversation"
      @cancel="cancelPublish"
    />
    <SaveConversationPopUp
      :is-visible="showSaveModal"
      @confirm="saveChanges"
      @cancel="cancelSave"
    />
  </div>
</template>
