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
import 'vue3-emoji-picker/css';
import SaveConversationPopUp from './SaveConversationPopUp.vue';
import OtherMessageTypes from './OtherMessageTypes.vue';
import { date } from 'yup';

const route = useRoute();
const router = useRouter();
const props = defineProps<{  conversationId?: number }>();

const conversationId = ref<number | null>(props.conversationId ?? parseInt(route.params.id as string));
const messageUser = ref<string>('')
const messageInterlocutor = ref<string>('')
const showEmojiPickerUser = ref<boolean>(false)
const currentTarget = ref<'user' | 'interlocutor' | null>(null) 
const showEmojiPickerInterlocutor = ref<boolean>(false)
const showPublishModal = ref<boolean>(false)
const showSaveModal = ref<boolean>(false)
const isDropdownOpen = ref<boolean>(false)
const isConversationModified = ref<boolean>(false)
const initialvalues = ref(null)
const imageUserSend = ref<string | undefined>(undefined)
const imageInterlocutorSend = ref<string | undefined>(undefined)
const imageUserSelected = ref<File | null>(null)
const imageInterlocutorSelected = ref<File | null>(null)
const imgInputUser = ref<HTMLInputElement | null>(null)
const imgInputInterlocutor = ref<HTMLInputElement | null>(null)
const isRecordingUser = ref<boolean>(false)
const isRecordingInterlocutor = ref<boolean>(false)
const currentRecordingTarget = ref<'user' | 'interlocutor' | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([]);
const baseUrl= import.meta.env.VITE_BASE_URL;
let nextRoute: any = null

const { getCurrentTime} = useConversationUtils();

const { handleSubmit, errors, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(conversationSchema),
  
  initialValues: {
  title: '',
  description: '',
  categoriesId: [1],
  status: 'draft',
  isPublic: false,
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

const { messages, sendMessage } = useMessages(messagesUsers, setFieldValue)
const { status, isPublic, createFakeConversation, saveConversationChanges, publishConversationToPublic, deleteFakeConversation } = useConversation(conversationId, values, setFieldValue);

const sendUserMessage = async () => {
  if(!messageUser.value && !imageUserSelected.value) return;

  if(imageUserSelected.value && messageUser.value) {
    await sendMessage('user', messageUser.value, {image: imageUserSelected.value})
  } else if(imageUserSelected.value) {
    await sendMessage('user', '', {image: imageUserSelected.value})
  } else {
    await sendMessage('user', messageUser.value)
  }
  
  messageUser.value = ''
  imageUserSend.value = ''
  imageUserSelected.value = null
}

const sendInterlocutorMessage = async () => {
  if(!messageInterlocutor.value && !imageInterlocutorSelected.value) return;

  if(imageInterlocutorSelected.value && messageInterlocutor.value) {
    await sendMessage('interlocutor', messageInterlocutor.value, {image: imageInterlocutorSelected.value})
  } else if(imageInterlocutorSelected.value) {
    await sendMessage('interlocutor', '', {image: imageInterlocutorSelected.value})
  } else {
    await sendMessage('interlocutor', messageInterlocutor.value)
  }

  messageInterlocutor.value = ''
  imageInterlocutorSend.value = ''
  imageInterlocutorSelected.value = null

}

const submitForm = handleSubmit(async (formValues) => {
  try {
    await createFakeConversation(formValues);
    console.log("Conversation créé avec succès ");
    router.push('/mes-conversations');
  } catch (error) {
    console.error('Erreur lors de la conversation:', error);
  }
});

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

const toggleEmojiPicker = (target: 'user' | 'interlocutor') => {
  currentTarget.value = target

  if(target === 'user') {
    showEmojiPickerUser.value = !showEmojiPickerUser.value
    showEmojiPickerInterlocutor.value = false
  } else {
    showEmojiPickerInterlocutor.value = !showEmojiPickerInterlocutor.value
    showEmojiPickerUser.value = false
  } 
}

const emojiSelected = (event: any) => {
  console.log(event)
  const emoji = event.i; 
  if (currentTarget.value === 'user') {
    messageUser.value += emoji
    showEmojiPickerUser.value = false
  } else {
      messageInterlocutor.value += emoji;
      showEmojiPickerInterlocutor.value = false
  }
  currentTarget.value = null
}

const onImageClickedUser = () => {
  imgInputUser.value?.click()
}
const onImageClickedInterlocutor = () => {
  imgInputInterlocutor.value?.click()
}

const imageSelected =(event: Event, target: 'user' | 'interlocutor') => {
  const input = event.target as HTMLInputElement
  if(input.files) {
    const file = input.files[0]
    const reader = new FileReader();
    const maxSize = 2 * 1024 * 1024; 

    if(file.size > maxSize) {
      console.error('Le fichier dépasse la taille maximale de 2Mo');
      return;
    }

    reader.onload = () => {
      const imgPreview = reader.result as string;
      if(target === 'user') {
        imageUserSend.value = imgPreview
        imageUserSelected.value = file;
      } else {
        imageInterlocutorSend.value = imgPreview
        imageInterlocutorSelected.value = file
      }
    };
        reader.readAsDataURL(file); 
  }
}

const removeImage = (target: 'user' | 'interlocutor') => {
  if(target === 'user') {
    imageUserSend.value = '';
    imageUserSelected.value = null
  } else {
        imageInterlocutorSend.value = ''
        imageInterlocutorSelected.value = null
  }
}

const startVocal = async (target: 'user' | 'interlocutor') => {
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio :true})
    mediaRecorder.value = new MediaRecorder(stream);
    
    audioChunks.value = []

    mediaRecorder.value.ondataavailable = (e) =>{
      audioChunks.value.push(e.data);
    }

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm'})
      await sendMessage(target, '', {audio: audioBlob})
      
      audioChunks.value = [];
      if(target === 'user') {
        isRecordingUser.value = false
      } else {
        isRecordingInterlocutor.value = false
      }    
    }

    mediaRecorder.value.start();
    if(target === 'user') {
        isRecordingUser.value = true
        isRecordingInterlocutor.value = false
      } else {
        isRecordingInterlocutor.value = true
        isRecordingUser.value = false

      } 
    } catch(error) {
    console.error('Erreur lors du vocal:', error);
    }
}

const onAudioClicked = (target: 'user' | 'interlocutor') => {

if(target === 'user') {
  if(isRecordingUser.value) {
    mediaRecorder.value?.stop()
  } else {
    startVocal('user')
  }
} else {
  if(isRecordingInterlocutor.value) {
    mediaRecorder.value?.stop()
  } else {
    startVocal('interlocutor')
  }
}
}


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

const onSubmit = () => {
  console.log("Submit simple déclenché");
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
      console.error('Erreur lors de la récupération de la conversation:', error);
    }
  }
})
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 min-h-screen">
    <form @submit.prevent="submitForm" class="w-full lg:w-1/2 bg-white p-4 md:p-6 rounded-lg shadow space-y-4 flex-shrink-0">
      <h2 class="text-xl font-semibold text-gray-800">Simulateur</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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


      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <!-- message user -->
        <div class="relative border p-4 rounded-lg shadow-sm">
          <label class="block text-sm font-medium text-gray-600 mb-2">Votre message</label>

          <div class="relative">
            <div v-if="imageUserSend" class="mb-2 w-16 h-16">
              <div class="relative">
                <img :src="imageUserSend" alt="Prévisualisation" class="w-16 h-16 object-cover rounded-md shadow border border-white" />
                <button
                  type="button"
                  @click="removeImage('user')"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-600">
                  &#10060
                </button>
              </div>
            </div>      
          
            <textarea v-model="messageUser" rows="4" class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 pt-6 focus:outline-none focus-ring-2 pl-2"></textarea>  
          </div>
          <div class="mt-2 flex justify-end space-x-2">
            <OtherMessageTypes 
              @emoji="() => toggleEmojiPicker('user')"
              @image="onImageClickedUser"
              @audio="onAudioClicked('user')"
              :is-recording="isRecordingUser"
            />
          </div>

          <EmojiPicker v-if="showEmojiPickerUser" :native="true" @select="emojiSelected" class="absolute bottom-28 roight-4 z-10"></EmojiPicker>
          <input type="file" accept="image/*" @change="imageSelected($event, 'user')" ref="imgInputUser" style="display: none;">

          <button type="button" @click="sendUserMessage"
            class="mt-4 w-full bg-blue-500 text-white py-2 rounded">
            Envoyer
          </button>
        </div>

        <!-- message interlocuteur -->
        <div class="relative border p-4 rounded-lg shadow-sm">
          <label class="block text-sm font-medium text-gray-600 mb-2">Son message</label>
          
          <div class="relative">
            <div v-if="imageInterlocutorSend" class="mb-2 w-16 h-16">
              <div class="relative">
                <img :src="imageInterlocutorSend" alt="Prévisualisation" class="w-16 h-16 object-cover rounded-md shadow border border-white" />
                <button
                  type="button"
                  @click="removeImage('interlocutor')"
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-600">
                  &#10060
                </button>
              </div>
            </div>      
          
          <textarea v-model="messageInterlocutor" rows="4" class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 pt-6 focus:outline-none focus-ring-2 pl-2"></textarea>
          </div>
          
           <div class="mt-2 flex justify-end space-x-2">
            <OtherMessageTypes 
              @emoji="() => toggleEmojiPicker('interlocutor')"
              @image="onImageClickedInterlocutor"
              @audio="onAudioClicked('interlocutor')"
              :is-recording="isRecordingInterlocutor"
            />
          </div>
          
          <EmojiPicker v-if="showEmojiPickerInterlocutor" :native="true" @select="emojiSelected" class="absolute bottom-28 right-4 z-10"></EmojiPicker>
          <input type="file" accept="image/*" @change="imageSelected($event, 'interlocutor')" ref="imgInputInterlocutor" style="display: none;">

          <button type="button" @click="sendInterlocutorMessage"
            class="mt-4 w-full bg-blue-500 text-white py-2 rounded">
            Envoyer
          </button>
        </div>
      </div>

      <div class="flex justify-between space-x-2">


          <button
          v-if="!conversationId "
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Créer la conversation
        </button>


          <button 
          v-else="conversationId"
          type="button" 
          @click="deleteConversaiton"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Supprimer la conversation
        </button>

        <div v-if="status === 'draft' && conversationId" class="relative inline-block text-left">
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
        <div>
            <button
              v-if="status === 'published' && conversationId"
              type="button"
              @click="saveChanges"
              class="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Enregistrer les modifications
            </button>
        </div>
     
      </div>
    </form>

    <!-- Prévisualisation -->
    <div class="w-full md:w-1/2 bg-white rounded-lg shadow p-4 flex flex-col h-auto">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">TalksLab</h2>
      
      <div class="bg-gray-100 p-4 rounded space-y-2 text-sm">
        <div class="flex justify-between item-center text-xs text-gray-500 border-b pb-2 mb-4">
          <span>{{ getCurrentTime(startTime) }}</span>
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
        <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto overflow-x-hidden flex-grow" >
        <div v-for="(msg, index) in messages" :key="index" class="mt-2">
          <div class="w-full p-2 rounded shadow text-gray-700 break-words">
              <div v-if="msg.message" class="whitespace-pre-wrap break-all">
                {{ msg.message }}

              </div>
              <div v-if="msg.image">
                <img 
                  v-if="msg.image"
                  :src="`${baseUrl}${msg.image}`" 
                  alt="Image" 
                  class="max-w-full max-h-20 mt-1 object-contain" 
                />

              </div>
              <div v-if="msg.audio" class="text-sm rounded-2xl px-4 py-2 max-w-xs w-full flex items-center gap-3 shadow">
                <audio controls :src="`${baseUrl}${msg.audio}`" :class="[msg.author === 'user' ? 'text-right self-end' : 'text-left self-start']" class="w-full h-10 [&::-webkit-media-controls-panel]:bg-green-100 [&::-webkit-media-controls-play-button]:hover:scale-110 transition-all"></audio>
              </div>

              <div v-if="msg.reaction" class="text-xs mt-1">Réaction : {{ msg.reaction }}</div>

          </div>
          <div v-if="msg.author === 'user' && msg.isSeen" class="text-xs text-gray-400 mt-1 text-right">
            <span class="text-black-500">Vu</span>
          </div>
        </div>
        </div>
        <button class="mt-4 w-full bg-gray-300 text-gray-700 px-3 py-2 rounded">Télécharger la conversation</button>


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
