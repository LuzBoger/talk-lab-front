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
  <div class="flex flex-col lg:flex-row gap-12 p-4 lg:p-6 min-h-screen bg-[#11101A] text-white">
    <form @submit.prevent="submitForm" class="w-full space-y-4">
        <input type="text" v-model="title" placeholder="Titre de la conversation" class="w-full bg-[#23233F] text-white p-2 rounded" />
      <div class="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-6">
        <!-- Heure -->
        <div>
          <label class="text-sm font-medium text-white mb-1 block">L'heure</label>
          <input type="datetime-local" v-model="startTime" class="bg-[#23233F] text-white p-2 rounded w-full" />
        </div>
        <!-- Batterie -->
        <div>
          <label class="text-sm font-medium text-white mb-1 block">Batterie</label>
          <input type="number" v-model="batteryLevel" class="bg-[#23233F] text-white p-2 rounded w-full" />
        </div>
        <!-- Réseau -->
        <div>
          <label class="text-sm font-medium text-white mb-1 block">Type de réseau</label>
          <input type="text" v-model="reseau" class="bg-[#23233F] text-white p-2 rounded w-full" />
        </div>
        <!-- Signal -->
        <div>
          <label class="text-sm font-medium text-white mb-1 block">Qualité du signal</label>
          <input type="number" v-model="signal" class="bg-[#23233F] text-white p-2 rounded w-full" />
        </div>
      </div>
      <div>
        <label class="text-sm font-medium text-white">Description de la conversation</label>
        <textarea v-model="description" class="w-full bg-[#23233F] text-white py-2 rounded h-24" rows="3"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Nom de l’interlocuteur -->
        <div>
          <label class="text-sm font-medium text-white">Nom de l’interlocuteur</label>
          <input type="text" v-model="interlocutor_name" class="w-full px-3 py-2 rounded bg-[#23233F]" />
        </div>
        <!-- Pseudo de l’interlocuteur -->
        <div>
          <label class="text-sm font-medium text-white">Pseudo de l’interlocuteur</label>
          <input type="text" v-model="interlocutor_username" class="w-full px-3 py-2 rounded bg-[#23233F]" />
        </div>
      </div>

      <!-- Photo de profil -->
      <div>
        <label class="text-sm font-medium text-white">Photo de profil</label>
        <input type="text" v-model="interlocutor_avatar" class="w-full px-3 py-2 rounded bg-[#23233F]" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- message user -->
        <div class="relative p-4 rounded-lg shadow-sm">
          <label class="block text-sm font-medium text-white mb-2">Votre message</label>

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
            <textarea v-model="messageUser" rows="4" class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 pt-6 focus:outline-none focus-ring-2 pl-2 bg-[#23233F]"></textarea>  
          </div>
          <div class="mb-4 flex justify-end space-x-2">
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
            class="mt-4 w-full bg-[#23CE6B] text-black py-2 rounded cursor-pointer">
            Envoyer
          </button>
        </div>

        <!-- message interlocuteur -->
        <div class="relative p-4 rounded-lg shadow-sm">
          <label class="block text-sm font-medium text-white mb-2">Son message</label>
          
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
          
          <textarea v-model="messageInterlocutor" rows="4" class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 pt-6 focus:outline-none focus-ring-2 pl-2 bg-[#23233F]"></textarea>
          </div>
          
           <div class="mb-4 flex justify-end space-x-2">
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
            class="mt-4 w-full bg-[#23CE6B] text-black py-2 rounded cursor-pointer">
            Envoyer
          </button>
        </div>
      </div>

      <div class="flex flex-wrap justify-between items-start gap-2 mt-4 flex-row sm:flex-col">
        <div class="flex flex-wrap gap-2 flex-1">
          
          <button
            v-if="!conversationId "
            type="submit"
            class="bg-[#1E90FF] text-black px-4 py-2 rounded-md cursor-pointer">
            Créer la conversation
          </button>

          <button 
            v-else="conversationId"
            type="button" 
            @click="deleteConversaiton"
            class="bg-[#EC221F] text-black px-4 py-2 rounded-md cursor-pointer">
            Supprimer la conversation
          </button>        
        </div>

        <div class="flex gap-2 flex-wrap mt-2 sm:mt-0">
            <div v-if="status === 'draft' && conversationId" class="flex gap-2 flex-wrap">
              <button 
                type="button"
                @click="openSaveModal" 
                class="bg-[#23CE6B] text-black px-4 py-2 rounded-md cursor-pointer">
                Enregistrer les modifications
              </button>

              <button 
                type="button"
                @click="openPublishModal" 
                class="bg-[#1E90FF] px-4 py-2 rounded-md cursor-pointer">
                Publier la conversation
              </button>
            </div>
              <button
                v-if="status === 'published' && conversationId"
                type="button"
                @click="saveChanges"
                class="bg-[#23CE6B] px-4 py-2 rounded-md cursor-pointer">
                Enregistrer les modifications
              </button>
          </div>
      </div>
    </form>


    <!-- Preview -->
    <div  class="flex flex-col items-center space-y-2 w-full lg:1/2">
    <div class="relative w-72 h-[600px] rounded-[45px] border-8 border-zinc-900 shadow-md bg-zinc-500 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 transition-colors">
    
      <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-[90px] h-[22px] bg-zinc-900 rounded-full z-20"></div>
        <div class="absolute -inset-[1px] border-[3px] border-zinc-700 border-opacity-40 rounded-[37px] pointer-events-none"></div>
        <div class="relative w-full h-full  rounded-[37px] overflow-hidden bg-zinc-900/10">
            
        <div class="flex justify-between item-center text-xs text-white mt-12 mb-2 ml-2">
          <span>{{ getCurrentTime(startTime) }}</span>
          <div class="flex items-center gap-1">
            <div class="flex items-center gap-1">
              <div class="flex items-end gap-1 ml-1">
                <div v-for="i in 5" :key="i" class="w-[3px] rounded-full"
                  :class="{
                    'bg-white': i <= signal,
                    'bg-gray-500': i> signal
                  }"
                  :style="{height: `${i * 2 + 3}px` }">
                </div>
                {{ reseau }}
              </div>

              <div class="relative w-6 h-3 border border-gray-500 rounded-sm flex items-center">
                  <div class="h-full transition-all duration-300°" :class="{
                    'bg-red-500': batteryLevel <= 20,
                    'bg-yellow-400': batteryLevel > 20 && batteryLevel <= 50,
                    'bg-green-500': batteryLevel > 50
                    }" 
                    :style="{ width: Math.max(0, Math.min(batteryLevel, 100)) * 0.22 + 'px' }">
                  </div>
                </div>
            </div>  
             <span>{{ batteryLevel }}%</span>
          </div>
        </div>
      
        <div class="flex items-center gap-3 mb-2">
          <img :src="interlocutor_avatar || defaultAvatar" alt="Avatar" class="w-8 h-8 rounded-full">
          <div class="font-semibold text-sm">{{ interlocutor_name }}</div>
          <div class="text-xs text-gray-400">@{{interlocutor_username }}</div>
        </div>

        <div class="flex flex-col gap-2 max-h-[400px] overflow-y-auto overflow-x-hidden flex-grow" >
          <div v-for="(msg, index) in messages" :key="index" :class="['flex', msg.author === 'user' ? 'justify-end' : 'justify-start']">
            <div class="w-full p-2 rounded shadow text-gray-700 break-words">
              <div v-if="msg.message" class="whitespace-pre-wrap break-all">
                {{ msg.message }}
              </div>

              <div v-if="msg.image" class="mt-1">
                <img 
                  v-if="msg.image"
                  :src="`${baseUrl}${msg.image}`" 
                  alt="Image" 
                  class="max-w-full max-h-24 object-contain rounded" 
                />
              </div>

              <div v-if="msg.audio" class="text-sm rounded-2xl px-4 py-2 max-w-xs w-full flex items-center gap-3 shadow">
                <audio controls :src="`${baseUrl}${msg.audio}`" class="w-full h-10 [&::-webkit-media-controls-panel]:bg-gray-200 dark:[&::-webkit-media-controls-panel]:bg-zinc-700 transition-all"></audio>
              </div>

              <div v-if="msg.reaction" class="text-xs mt-1">Réaction : {{ msg.reaction }}</div>

          </div>
          <div v-if="msg.author === 'user' && msg.isSeen" class="text-xs text-gray-400 mt-1 text-right">
            <span class="text-black-500">Vu</span>
          </div>
        </div>
        </div>
        <button class="mt-4 w-full bg-gray-300 text-gray-700 px-3 py-2 rounded">Télécharger la conversation</button>
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-12 bg-zinc-600 blur-[80px]">

            </div>
        </div>
        
        <div class="absolute left-[-12px] top-20 w-[6px] h-8 bg-zinc-900 rounded-l-md shadow-md"></div>
        
        <div class="absolute left-[-12px] top-36 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>
        
        <div class="absolute left-[-12px] top-52 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>
        
        <div class="absolute right-[-12px] top-36 w-[6px] h-16 bg-zinc-900 rounded-r-md shadow-md"></div>
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
