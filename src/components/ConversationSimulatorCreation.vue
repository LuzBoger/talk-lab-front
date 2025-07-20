<script setup lang="ts">
import { watch } from 'vue'
import PublishConversationPopUp from './PublishConversationPopUp.vue';
import CategorySelectedModal from './CategorySelectedModal.vue';
import EmojiPicker from 'vue3-emoji-picker';
import SaveConversationPopUp from './SaveConversationPopUp.vue';
import OtherMessageTypes from './OtherMessageTypes.vue';
import 'vue3-toastify/dist/index.css';
import PreviewHeader from './preview/PreviewHeader.vue';
import UserInfo from './preview/UserInfo.vue';
import MessageContainer from './preview/MessageContainer.vue';
import BottomBar from './preview/BottomBar.vue';
import clsx from 'clsx';
import { useConversationSimulator } from '../composables/useConversationSimulator';
import { useAuthStore } from '../stores/useAuthStore';
const sim = useConversationSimulator();
const authStore = useAuthStore();
const optionsBat = ['full', 'green', 'yellow', 'red']
const optionsSignal = ['Bien', 'Moyen']

watch(() => sim.imageInterlocutorSend.value, (newVal) => {
  console.log('imageInterlocutorSend changed:', newVal)
})
function handleCategorySave(categories: number[]) {
    console.log('Creating new conversation with categories:', categories);
    sim.handleCreateConversation(categories);
}
</script>

<template>
  <div class="flex flex-col lg:flex-row p-4 min-h-screen text-white">
    <form @submit.prevent="sim.onSubmit" class="space-y-4 p-2 sm:p-4 rounded-lg w-full max-w-3xl mx-auto">
  <!-- Titre + bouton catégorie -->
  <div class="flex flex-col sm:flex-row gap-2">
    <input
      type="text"
      v-model="sim.title.value"
      placeholder="Titre de la conversation"
      :class="clsx('w-full h-10 bg-sidebar-bg text-white p-2 rounded', sim.submitCount.value > 0 && sim.errors.value.title && 'border border-red-700')"
    />
    <button
      type="button" @click="sim.showCategoryModal.value = true; console.log('open modal, id:', sim.conversationId.value);"
      :class="clsx('w-full sm:w-auto bg-sidebar-bg text-white p-2 rounded cursor-pointer')"
    >
      Ouvrir la modale des catégories
    </button>
  </div>

  <div class="bg-sidebar-bg p-2 sm:p-4 rounded-lg space-y-4">
    <!-- Grille des paramètres principaux -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Heure -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-white">L'heure <span class="text-red-600">*</span></label>
        <input
          type="time"
          v-model="sim.startTime.value"
          :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.startTime'] && 'border border-red-700')"
        />
      </div>
      <!-- Batterie -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-white">Batterie <span class="text-red-600">*</span></label>
        <select
          v-model="sim.batteryLevel.value"
          :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.batteryLevel'] && 'border border-red-700')"
        >
          <option v-for="option in optionsBat" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <!-- Réseau -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-white">Type de réseau <span class="text-red-600">*</span></label>
        <input
          type="text"
          v-model="sim.reseau.value"
          :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.reseau'] && 'border border-red-700')"
        />
      </div>
      <!-- Signal -->
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-white">Qualité du signal <span class="text-red-600">*</span></label>
        <select
          v-model="sim.signal"
          :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.signal'] && 'border border-red-700')"
        >
          <option v-for="option in optionsSignal" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <!-- Description -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-white">Description de la conversation<span class="text-red-600">*</span></label>
      <textarea
        v-model="sim.description.value"
        :class="clsx('w-full px-2 bg-card-bg text-white py-2 rounded h-24', sim.submitCount.value > 0 && sim.errors.value.description && 'border border-red-700')"
        rows="3"
      ></textarea>
    </div>

    <!-- Interlocuteur -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-white">Nom de l’interlocuteur <span class="text-red-600">*</span></label>
        <input
          type="text"
          v-model="sim.interlocutor_name.value"
          :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.interlocutor_name'] && 'border border-red-700')"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-white">Pseudo de l’interlocuteur <span class="text-red-600">*</span></label>
        <input
          type="text"
          v-model="sim.interlocutor_username.value"
          :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.interlocutor_username'] && 'border border-red-700')"
        />
      </div>
    </div>

    <!-- Photo de profil -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-white">Photo de profil <span class="text-red-600">*</span></label>
      <input
        type="file"
        @change="sim.handleFileUpload"
        accept="image/*"
        :class="clsx('bg-card-bg text-white p-2 rounded w-full', sim.submitCount.value > 0 && sim.errors.value?.['content.interlocutor_avatar'] && 'border border-red-700')"
      />
    </div>

    <!-- Messages -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Message user -->
      <div class="rounded-lg shadow-sm flex flex-col">
        <label class="block text-sm font-medium text-white mb-2">Votre message</label>
        <div class="relative">
          <div v-if="sim.imageUserSend.value" class="mb-2 w-16 h-16">
            <div class="relative">
              <img :src="sim?.imageUserSend.value" alt="Prévisualisation de l'image transmise par l'utilisateur"
                class="w-16 h-16 object-cover rounded-md shadow border border-white" loading="lazy" />
              <button type="button" @click="sim.removeImage('user')"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-600">
                &#10060
              </button>
            </div>
          </div>
          <textarea v-model="sim.messageUser.value" rows="4"
            class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 focus:outline-none focus-ring-2 pl-2 bg-card-bg"></textarea>
        </div>
        <div class="mb-4 flex justify-end space-x-2">
          <OtherMessageTypes @emoji="() => sim.toggleEmojiPicker('user')" @image="sim.onImageClickedByUser"
            @audio="sim.onAudioClicked('user')" :is-recording="sim.isRecordingUser.value" />
        </div>
        <EmojiPicker v-if="sim.showEmojiPickerUser.value" :native="true" @select="sim.emojiSelected"
          class="absolute bottom-28 right-4 z-10"></EmojiPicker>
        <input type="file" accept="image/*" @change="sim.imageSelected($event, 'user')" :ref="sim.imgInputUser"
          style="display: none;">
        <button type="button" @click="sim.sendUserMessage"
          class="w-full bg-main-color hover:bg-main-color-hover text-black py-2 rounded cursor-pointer font-medium">
          Envoyer
        </button>
      </div>
      <!-- Message interlocuteur -->
      <div class="rounded-lg shadow-sm flex flex-col">
        <label class="block text-sm font-medium text-white mb-2">Son message</label>
        <div class="relative">
          <div v-if="sim.imageInterlocutorSend.value" class="mb-2 w-16 h-16">
            <div class="relative">
              <img :src="sim?.imageInterlocutorSend.value" alt="Prévisualisation de l'image trasnmise par l'interlocuteur" 
                class="w-16 h-16 object-cover rounded-md shadow border border-white" loading="lazy" />
              <button type="button" @click="sim.removeImage('interlocutor')"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow hover:bg-red-600">
                &#10060
              </button>
            </div>
          </div>
          <textarea v-model="sim.messageInterlocutor.value" rows="4"
            class="w-full resize-none outline-none border border-gray-300 rounded-md p-2 focus:outline-none focus-ring-2 pl-2 bg-card-bg"></textarea>
        </div>
        <div class="mb-4 flex justify-end space-x-2">
          <OtherMessageTypes @emoji="() => sim.toggleEmojiPicker('interlocutor')"
            @image="sim.onImageClickedByInterlocutor" @audio="sim.onAudioClicked('interlocutor')"
            :is-recording="sim.isRecordingInterlocutor.value" />
        </div>
        <EmojiPicker v-if="sim.showEmojiPickerInterlocutor.value" :native="true" @select="sim.emojiSelected"
          class="absolute bottom-28 right-4 z-10" />
        <input type="file" accept="image/*" @change="sim.imageSelected($event, 'interlocutor')"
          :ref="sim.imgInputInterlocutor" style="display: none;">
        <button type="button" @click="sim.sendInterlocutorMessage"
          class="w-full bg-main-color hover:bg-main-color-hover text-black py-2 rounded cursor-pointer font-medium">
          Envoyer
        </button>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex flex-col sm:flex-row flex-wrap justify-between items-stretch gap-2 mt-4">
      <div class="flex flex-col sm:flex-row justify-end w-full gap-2">
        <span v-if="Object.keys(sim.errors.value).length > 0" class="text-white bg-red-600 p-2 rounded-lg text-center">Veuillez
          remplir correctement tous les champs du formulaire</span>
        <button v-if="!sim.conversationId.value" type="submit"
          class="bg-publish-button hover:bg-publish-button-hover text-black px-4 py-2 rounded-md cursor-pointer font-medium w-full sm:w-auto">
          Créer
        </button>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <div v-if="sim.status.value === 'draft' && sim.conversationId.value"
          class="flex flex-col sm:flex-row gap-2 w-full">
          <button type="button" @click="sim.deleteConversaiton"
            class="bg-cancel-color hover:bg-cancel-hover text-white px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto">
            Supprimer la conversation
          </button>
          <button type="button" @click="sim.openSaveModal"
            class="bg-main-color hover:bg-main-color-hover text-black px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto">
            Enregistrer les modifications
          </button>
          <button v-if="authStore.hasSubscription" type="button" @click="sim.openPublishModal"
            class="bg-publish-button hover:bg-publish-button-hover px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto">
            Publier la conversation
          </button>
          <div v-else class="bg-gray-500 text-white px-4 py-2 rounded-md cursor-not-allowed w-full sm:w-auto text-center">
            Un abonnement est requis pour publier une conversation
          </div>
        </div>
        <button v-if="sim.status.value === 'published' && sim.conversationId.value" type="button"
          @click="sim.deleteConversaiton"
          class="bg-cancel-color hover:bg-cancel-hover text-white px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto">
          Supprimer la conversation
        </button>
      </div>
    </div>
  </div>
</form>
    <div>
      <div class="w-preview h-preview flex flex-col justify-between font-sans-sf bg-white">
        <div>
          <PreviewHeader :Hour="sim.startTime.value" :signalSelected="sim.signal.value" :networks="sim.reseau.value"
            :batSelected="sim.batteryLevel.value" />
          <UserInfo :interlocutorName="sim.interlocutor_name.value"
            :interlocutorUsername="sim.interlocutor_username.value"
            :interlocutorAvatar="sim.interlocutor_avatar.value" />
          <MessageContainer :messages="sim.messages.value" :interlocutorAvatar="sim.interlocutor_avatar.value"
            :addReaction="sim.addReaction" />
        </div>
        <div class="flex flex-col items-center">
          <BottomBar />
          <div class="min-w-32 max-w-32 min-h-[5px] mb-1.5 rounded-full bg-black"></div>
        </div>
      </div>
    </div>
    <PublishConversationPopUp :is-visible="sim.showPublishModal.value" @confirm="sim.publishConversation"
      @cancel="sim.cancelPublish" />
    <SaveConversationPopUp :is-visible="sim.showSaveModal.value" @confirm="sim.saveChanges" @cancel="sim.cancelSave" />
    <CategorySelectedModal v-if="sim.showCategoryModal.value" :selectedCategories="sim.selectedCategories.value"
      :categories="sim.categoryStore.categories" :is-visible="sim.showCategoryModal.value" @save="handleCategorySave"
      @close="sim.showCategoryModal.value = false" />
  </div>
</template>
