<script setup lang="ts">

import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { conversationSchema } from '../validation/conversationSchema';
import type { Messages } from '../types/Messages';
import { getConversationById } from '../api/conversation';
import { useMessages } from '../composables/useMessages';
import { useConversation } from '../composables/useConversation';
import { useConversationUtils } from '../utils/useConversationUtils';
import PublishConversationPopUp from './PublishConversationPopUp.vue';
import CategorySelectedModal from './CategorySelectedModal.vue';
import Reaction from './Reaction.vue';
import defaultAvatar from '../assets/images/defaultAvatar.png';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import SaveConversationPopUp from './SaveConversationPopUp.vue';
import OtherMessageTypes from './OtherMessageTypes.vue';
import { date } from 'yup';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useCategoryStore } from '../stores/useCategoryStore';
import PreviewHeader from './preview/PreviewHeader.vue';


const route = useRoute();
const router = useRouter();
const props = defineProps<{ conversationId?: number }>();

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
const baseUrl = import.meta.env.VITE_BASE_URL;
let nextRoute: any = null
const showCategoryModal = ref<boolean>(false)
const categoryStore = useCategoryStore()
const selectedCategories = ref<number[]>([])

const { getCurrentTime } = useConversationUtils();

const { handleSubmit, errors, setFieldValue, values } = useForm({
  validationSchema: toTypedSchema(conversationSchema),

  initialValues: {
    title: '',
    description: '',
    categoriesId: [],
    status: 'draft',
    isPublic: false,
    content: {
      interlocutor_name: '',
      interlocutor_username: '',
      interlocutor_avatar: '',
      startTime: '',
      batteryLevel: "full",  //TODO : Changer aussi la gestion dans symfony (number -> string)
      reseau: '',
      signal: "Bien", //TODO : Changer aussi la gestion dans symfony (number -> string)
      messages: [],
    }
  }
});
const { value: title } = useField<string>('title');
const { value: description } = useField<string>('description');
const { value: startTime } = useField<string>('content.startTime');
const { value: batteryLevel } = useField<string>('content.batteryLevel');
const optionsBat = ['full', 'green', 'yellow', 'red'] // TODO: faire un enum
const { value: reseau } = useField<string>('content.reseau');
const { value: signal } = useField<string>('content.signal');
const optionsSignal = ['Bien', 'Moyen']; // TODO: faire un enum
const { value: interlocutor_name } = useField<string>('content.interlocutor_name');
const { value: interlocutor_username } = useField<string>('content.interlocutor_username');
const { value: interlocutor_avatar } = useField<string>('content.interlocutor_avatar');
const { value: messagesUsers } = useField<Messages[]>('content.messages');

const { messages, sendMessage } = useMessages(messagesUsers, setFieldValue)
const { status, isPublic, createFakeConversation, saveConversationChanges, publishConversationToPublic, deleteFakeConversation } = useConversation(conversationId, values, setFieldValue);

const sendUserMessage = async () => {
  if (!messageUser.value && !imageUserSelected.value) return;

  if (imageUserSelected.value && messageUser.value) {
    await sendMessage('user', messageUser.value, { image: imageUserSelected.value })
  } else if (imageUserSelected.value) {
    await sendMessage('user', '', { image: imageUserSelected.value })
  } else {
    await sendMessage('user', messageUser.value)
  }

  messageUser.value = ''
  imageUserSend.value = ''
  imageUserSelected.value = null
}

const sendInterlocutorMessage = async () => {
  if (!messageInterlocutor.value && !imageInterlocutorSelected.value) return;

  if (imageInterlocutorSelected.value && messageInterlocutor.value) {
    await sendMessage('interlocutor', messageInterlocutor.value, { image: imageInterlocutorSelected.value })
  } else if (imageInterlocutorSelected.value) {
    await sendMessage('interlocutor', '', { image: imageInterlocutorSelected.value })
  } else {
    await sendMessage('interlocutor', messageInterlocutor.value)
  }

  messageInterlocutor.value = ''
  imageInterlocutorSend.value = ''
  imageInterlocutorSelected.value = null

}

const submitForm = handleSubmit(async (formValues) => {
  try {
    const res = await createFakeConversation(formValues);
    toast.success(res.message);
    router.push('/profil/mes-conversations');
  } catch (error: any) {
    toast.error('Erreur lors de la création de la conversation');

  }
});

const saveChanges = async () => {
  try {
    await saveConversationChanges();
    toast.success("Changements sauvegardés avec succès");
    isConversationModified.value = false
    showSaveModal.value = false
    if (nextRoute) {
      await router.push(nextRoute)
    }
  } catch (error) {
    toast.error('Erreur lors de la sauvegarde des modifications');
  }

}

const cancelSave = () => {
  showSaveModal.value = false
}

const publishConversation = async () => {
  if (!conversationId) {
    toast.error('La conversation n\'existe pas');
    return
  }
  try {
    await publishConversationToPublic();
    toast.success('Conversation publiée avec succès');
    showPublishModal.value = false
    isConversationModified.value = false
  } catch (error) {
    console.error('Erreur lors de la publication de la conversation:', error);
    toast.error('Erreur lors de la publication de la conversation');
  }
}

const cancelPublish = () => {
  showPublishModal.value = false
}

const deleteConversaiton = async () => {
  if (!conversationId) {
    toast.error('La conversation n\'existe pas');
    return
  }

  try {
    await deleteFakeConversation()
    router.push('/profil/mes-conversations')

  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation:', error);
    toast.error('Erreur lors de la suppression de la conversation');
  }

}
const addReaction = (index: number, emoji: string) => {
  const uptadedMessages = [...messages.value]
  uptadedMessages[index].reaction = emoji
  messages.value = uptadedMessages
  setFieldValue('content.messages', uptadedMessages)
}
// const removeReaction = (index: number) => {
//   addReaction(index, '')  
// }

const toggleEmojiPicker = (target: 'user' | 'interlocutor') => {
  currentTarget.value = target

  if (target === 'user') {
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

const onImageClickedByUser = () => {
  imgInputUser.value?.click()
}
const onImageClickedByInterlocutor = () => {
  imgInputInterlocutor.value?.click()
}

const imageSelected = (event: Event, target: 'user' | 'interlocutor') => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const file = input.files[0]
    const reader = new FileReader();
    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      console.error('Le fichier dépasse la taille maximale de 2Mo');
      return;
    }

    reader.onload = () => {
      const imgPreview = reader.result as string;
      if (target === 'user') {
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
  if (target === 'user') {
    imageUserSend.value = '';
    imageUserSelected.value = null
  } else {
    imageInterlocutorSend.value = ''
    imageInterlocutorSelected.value = null
  }
}

const startVocal = async (target: 'user' | 'interlocutor') => {

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.value = new MediaRecorder(stream);

    audioChunks.value = []

    mediaRecorder.value.ondataavailable = (e) => {
      audioChunks.value.push(e.data);
    }

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' })
      await sendMessage(target, '', { audio: audioBlob })

      audioChunks.value = [];
      if (target === 'user') {
        isRecordingUser.value = false
      } else {
        isRecordingInterlocutor.value = false
      }
    }

    mediaRecorder.value.start();
    if (target === 'user') {
      isRecordingUser.value = true
      isRecordingInterlocutor.value = false
    } else {
      isRecordingInterlocutor.value = true
      isRecordingUser.value = false

    }
  } catch (error) {
    console.error('Erreur lors du vocal:', error);
  }
}

const onAudioClicked = (target: 'user' | 'interlocutor') => {

  if (target === 'user') {
    if (isRecordingUser.value) {
      mediaRecorder.value?.stop()
    } else {
      startVocal('user')
    }
  } else {
    if (isRecordingInterlocutor.value) {
      mediaRecorder.value?.stop()
    } else {
      startVocal('interlocutor')
    }
  }
}

const openSaveModal = () => {
  showSaveModal.value = true;
  isDropdownOpen.value = false;
};

const openPublishModal = () => {
  showPublishModal.value = true;
  isDropdownOpen.value = false;
};
const openCategoryModal = () => {
  selectedCategories.value = [...(values.categoriesId ?? [])]
  showCategoryModal.value = true
}

const handleCreateConversation = async (categories: number[]) => {
  selectedCategories.value = [...categories]
  await setFieldValue('categoriesId', [...categories])
  showCategoryModal.value = false
  await submitForm()


}
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
  if (!initialvalues.value) { return }
  const isModified = JSON.stringify(newVal) !== JSON.stringify(initialvalues.value)
  isConversationModified.value = isModified
}, { deep: true })


onMounted(async () => {
  console.log('errors:', errors.value);
  if (conversationId.value) {
    try {
      const response = await getConversationById(conversationId.value);
      setFieldValue('title', response.title);
      setFieldValue('description', response.description);
      setFieldValue('content', response.content);
      setFieldValue('categoriesId', response.categoriesId)
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
  <div class="flex flex-col lg:flex-row p-4 min-h-screen text-white">
    <form @submit.prevent="submitForm" class="space-y-4 p-4 rounded-lg w-form">
      <input type="text" v-model="title" placeholder="Titre de la conversation"
        class="w-80 bg-sidebar-bg text-white p-2 rounded" />
      <div class="bg-sidebar-bg p-4 rounded-lg space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-6">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-white">L'heure</label>
            <input type="time" v-model="startTime" class="bg-card-bg text-white p-2 rounded w-full" />
          </div>
          <!-- Batterie -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-white">Batterie</label>
            <select v-model="batteryLevel" class="bg-card-bg text-white p-2 rounded w-full">
              <option v-for="option in optionsBat" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
          <!-- Réseau -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-white">Type de réseau</label>
            <input type="text" v-model="reseau" class="bg-card-bg text-white p-2 rounded w-full" />
          </div>
          <!-- Signal -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-white">Qualité du signal</label>
            <select v-model="signal" class="bg-card-bg text-white p-2 rounded w-full">
              <option v-for="option in optionsSignal" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-white">Description de la conversation</label>
          <textarea v-model="description" class="w-full bg-card-bg text-white py-2 rounded h-24" rows="3"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nom de l’interlocuteur -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-white">Nom de l’interlocuteur</label>
            <input type="text" v-model="interlocutor_name" class="w-full px-3 py-2 rounded bg-card-bg" />
          </div>
          <!-- Pseudo de l’interlocuteur -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-white">Pseudo de l’interlocuteur</label>
            <input type="text" v-model="interlocutor_username" class="w-full px-3 py-2 rounded bg-card-bg" />
          </div>
        </div>

        <!-- Photo de profil -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-white">Photo de profil</label>
          <input type="text" v-model="interlocutor_avatar" class="w-full px-3 py-2 rounded bg-card-bg" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- message user -->
          <div class="rounded-lg shadow-sm">
            <label class="block text-sm font-medium text-white mb-2">Votre message</label>

            <div class="relative">
              <div v-if="imageUserSend" class="mb-2 w-16 h-16">
                <div class="relative">
                  <img :src="imageUserSend" alt="Prévisualisation"
                    class="w-16 h-16 object-cover rounded-md shadow border border-white" />
                  <button type="button" @click="removeImage('user')"
                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-600">
                    &#10060
                  </button>
                </div>
              </div>
              <textarea v-model="messageUser" rows="4"
                class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 focus:outline-none focus-ring-2 pl-2 bg-card-bg"></textarea>
            </div>
            <div class="mb-4 flex justify-end space-x-2">
              <OtherMessageTypes @emoji="() => toggleEmojiPicker('user')" @image="onImageClickedByUser"
                @audio="onAudioClicked('user')" :is-recording="isRecordingUser" />
            </div>

            <EmojiPicker v-if="showEmojiPickerUser" :native="true" @select="emojiSelected"
              class="absolute bottom-28 roight-4 z-10"></EmojiPicker>
            <input type="file" accept="image/*" @change="imageSelected($event, 'user')" ref="imgInputUser"
              style="display: none;">

            <button type="button" @click="sendUserMessage"
              class="w-full bg-main-color hover:bg-main-color-hover text-black py-2 rounded cursor-pointer font-medium">
              Envoyer
            </button>
          </div>

          <!-- message interlocuteur -->
          <div class="rounded-lg shadow-sm">
            <label class="block text-sm font-medium text-white mb-2">Son message</label>
            <div class="relative">
              <div v-if="imageInterlocutorSend" class="mb-2 w-16 h-16">
                <div class="relative">
                  <img :src="imageInterlocutorSend" alt="Prévisualisation"
                    class="w-16 h-16 object-cover rounded-md shadow border border-white" />
                  <button type="button" @click="removeImage('interlocutor')"
                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-600">
                    &#10060
                  </button>
                </div>
              </div>

              <textarea v-model="messageInterlocutor" rows="4"
                class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 focus:outline-none focus-ring-2 pl-2 bg-card-bg"></textarea>
            </div>

            <div class="mb-4 flex justify-end space-x-2">
              <OtherMessageTypes @emoji="() => toggleEmojiPicker('interlocutor')" @image="onImageClickedByInterlocutor"
                @audio="onAudioClicked('interlocutor')" :is-recording="isRecordingInterlocutor" />
            </div>

            <EmojiPicker v-if="showEmojiPickerInterlocutor" :native="true" @select="emojiSelected"
              class="absolute bottom-28 right-4 z-10" />
            <input type="file" accept="image/*" @change="imageSelected($event, 'interlocutor')"
              ref="imgInputInterlocutor" style="display: none;">

            <button type="button" @click="sendInterlocutorMessage"
              class="w-full bg-main-color hover:bg-main-color-hover text-black py-2 rounded cursor-pointer font-medium">
              Envoyer
            </button>
          </div>
        </div>

        <div class="flex flex-wrap justify-between items-start gap-2 mt-4 flex-row sm:flex-col">
          <div class="flex justify-end w-full">

            <button v-if="!conversationId" type="button" @click="openCategoryModal"
              class="bg-publish-button hover:bg-publish-button-hover text-black px-4 py-2 rounded-md cursor-pointer font-medium">
              Créer
            </button>

            <button v-else="conversationId" type="button" @click="deleteConversaiton"
              class="bg-cancel-color text-black px-4 py-2 rounded-md cursor-pointer">
              Supprimer la conversation
            </button>
          </div>

          <div class="flex gap-2 flex-wrap mt-2 sm:mt-0">
            <div v-if="status === 'draft' && conversationId" class="flex gap-2 flex-wrap">
              <button type="button" @click="openSaveModal"
                class="bg-main-color text-black px-4 py-2 rounded-md cursor-pointer">
                Enregistrer les modifications
              </button>

              <button type="button" @click="openPublishModal"
                class="bg-publish-button px-4 py-2 rounded-md cursor-pointer">
                Publier la conversation
              </button>
            </div>
            <button v-if="status === 'published' && conversationId" type="button" @click="saveChanges"
              class="bg-main-color px-4 py-2 rounded-md cursor-pointer">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </form>
    <div>
      <div class="w-preview h-preview flex flex-col font-sans justify-between bg-white">
        <PreviewHeader :Hour="startTime" :signalSelected="signal" :networks="reseau" :batSelected="batteryLevel">
        </PreviewHeader>
      </div>
    </div>
    <PublishConversationPopUp :is-visible="showPublishModal" @confirm="publishConversation" @cancel="cancelPublish" />
    <SaveConversationPopUp :is-visible="showSaveModal" @confirm="saveChanges" @cancel="cancelSave" />
    <CategorySelectedModal v-if="showCategoryModal" :selectedCategories="selectedCategories"
      :categories="categoryStore.categories" :is-visible="showCategoryModal" @save="handleCreateConversation"
      @close="showCategoryModal = false" />
  </div>
</template>
