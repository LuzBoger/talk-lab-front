<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import LoadingSpinnerIcon from '../components/icon/LoadingSpinnerIcon.vue'

import type { RegisterData } from '../types/register/RegisterData'
import type { RegisterDataError } from '../types/register/RegisterDataError'

const props = defineProps<{
  form: RegisterData
  errors: RegisterDataError
  loading: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const submitForm = () => {
  emit('submit')
}
</script>

<template>
  <form class="w-80" @submit.prevent="submitForm">
    <div v-if="errorMessage"
      class="bg-error-message-light text-error-message p-2.5 rounded mb-3 text-center text-sm">
      {{ errorMessage }}
    </div>

    <div class="mb-3">
      <label for="name" class="block mb-1 text-white text-xs font-medium">Nom complet</label>
      <input type="text" id="name" v-model="form.name" placeholder="Prénom Nom"
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm" />
      <p v-if="errors.nameError" class="text-red-500 text-xs mt-1">
        {{ errors.nameError }}
      </p>
    </div>

    <div class="mb-3">
      <label for="username" class="block mb-1 text-white text-xs font-medium">Nom d'utilisateur</label>
      <input type="text" id="username" v-model="form.username" placeholder="Pseudo"
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm" />
      <p v-if="errors.usernameError" class="text-red-500 text-xs mt-1">
        {{ errors.usernameError }}
      </p>
    </div>

    <div class="mb-3">
      <label for="email" class="block mb-1 text-white text-xs font-medium">E-mail</label>
      <input type="email" id="email" v-model="form.email" placeholder="exemple@mail.com"
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm" />
      <p v-if="errors.emailError" class="text-red-500 text-xs mt-1">
        {{ errors.emailError }}
      </p>
    </div>

    <div class="mb-3">
      <label for="password" class="block mb-1 text-white text-xs font-medium">Mot de passe</label>
      <input type="password" id="password" v-model="form.password" placeholder="******"
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm" />
      <p v-if="errors.passwordError" class="text-red-500 text-xs mt-1">
        {{ errors.passwordError }}
      </p>
    </div>

    <div class="mb-3">
      <label for="confirmPassword" class="block mb-1 text-white text-xs font-medium">Confirmation mot de passe</label>
      <input type="password" id="confirmPassword" v-model="form.confirmPassword" placeholder="******"
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm" />
      <p v-if="errors.confirmPasswordError" class="text-red-500 text-xs mt-1">
        {{ errors.confirmPasswordError }}
      </p>
    </div>

    <button type="submit" :disabled="loading"
      class="w-full p-2.5 bg-validate-button hover:bg-validate-button-hover text-white rounded-lg font-semibold text-sm mt-2.5 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer">
      <span v-if="loading" class="inline-block mr-2 align-middle">
        <LoadingSpinnerIcon class="animate-spin h-5 w-5 text-white" />
      </span>
      S'inscrire
    </button>
  </form>
</template>
