<script setup lang="ts">
import type { LoginCredentials } from '../types/login/LoginCredentials'
import type { LoginCredentialsError } from '../types/login/LoginCredentialsError'
import LoadingSpinnerIcon from '../components/icon/LoadingSpinnerIcon.vue'

defineProps<{
  form: LoginCredentials
  errors: LoginCredentialsError
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
  <form @submit.prevent="submitForm" class="w-full flex flex-col gap-3">
    <div v-if="errorMessage" class="bg-error-message-light text-error-message p-2 rounded text-center text-sm font-semibold">
      {{ errorMessage }}
    </div>

    <div>
      <label for="email" class="block mb-1 text-white text-xs font-medium">E-mail</label>
      <input
        id="email"
        type="email"
        v-model="form.email"
        placeholder="exemple@mail.com"
        required
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm"
      />
      <p v-if="errors.emailError" class="text-red-500 text-xs mt-1">{{ errors.emailError }}</p>
    </div>

    <div>
      <label for="password" class="block mb-1 text-white text-xs font-medium">Mot de passe</label>
      <input
        id="password"
        type="password"
        v-model="form.password"
        placeholder="******"
        required
        class="w-full p-2.5 border border-gray-800 rounded-lg bg-card-bg text-white text-sm"
      />
      <p v-if="errors.passwordError" class="text-red-500 text-xs mt-1">{{ errors.passwordError }}</p>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full p-2.5 bg-validate-button hover:bg-validate-button-hover text-white rounded-lg font-semibold text-sm mt-2.5 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
    >
      <span v-if="loading" class="inline-block mr-2 align-middle">
        <LoadingSpinnerIcon class="animate-spin h-5 w-5 text-white" />
      </span>
      Se connecter
    </button>
  </form>
</template>
