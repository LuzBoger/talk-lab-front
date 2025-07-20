<script setup lang="ts">
import type { PasswordPayload } from '../types/updateProfil/PasswordPaylaod'
import type { UpdatePasswordError } from '../types/updateProfil/UpdatePasswordError'

defineProps<{
  form: PasswordPayload
  errors: UpdatePasswordError
}>()
const emit = defineEmits<{
  (e: 'update'): void
}>()

const updatePassword = () => {
  emit('update')
}
</script>

<template>
  <form @submit.prevent="updatePassword" class="flex flex-col space-y-4">
    <div class="flex flex-col">
      <label for="newPassword" class="text-sm font-medium"
        >Nouveau mot de passe</label
      >
      <input
        v-model="form.newPassword"
        type="password"
        id="newPassword"
        class="mt-1 p-2 bg-[#1E1E2F] rounded border border-[#2C2C3F] focus:outline-none focus:ring-2 focus:ring-[#3A3A4F]"
      />
      <span class="text-red-500 text-xs">{{ errors.newPasswordError }}</span>
    </div>

    <div class="flex flex-col">
      <label for="confirmPassword" class="text-sm font-medium"
        >Confirmer le mot de passe</label
      >
      <input
        v-model="form.confirmPassword"
        type="password"
        id="confirmPassword"
        class="mt-1 p-2 bg-[#1E1E2F] rounded border border-[#2C2C3F] focus:outline-none focus:ring-2 focus:ring-[#3A3A4F]"
      />
      <span class="text-red-500 text-xs">{{
        errors.confirmPasswordError
      }}</span>
    </div>

    <button
      type="submit"
      class="bg-publish-button text-white px-4 py-2 rounded hover:bg-publish-button-hover cursor-pointer"
    >
      Mettre à jour le mot de passe
    </button>
  </form>
</template>
