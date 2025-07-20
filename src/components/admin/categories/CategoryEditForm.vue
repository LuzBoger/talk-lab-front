<script setup lang="ts">
import type { Category } from '../../../types/Category'

defineProps<{
  form: Category
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
  <form
    @submit.prevent="submitForm"
    class="max-w-md mx-auto mt-8 p-4 bg-card-bg rounded shadow space-y-4"
  >
    <h2 class="text-xl font-bold text-gray-100 mb-4">Modifier la catégorie</h2>

    <div
      v-if="errorMessage"
      class="bg-red-600 text-white p-2 rounded mb-4 text-center"
    >
      {{ errorMessage }}
    </div>

    <div>
      <label class="block text-gray-200 mb-1">Nom</label>
      <input
        v-model="form.name"
        type="text"
        class="w-full rounded px-3 py-2 bg-bg-dark text-white border border-gray-800"
      />
    </div>

    <div>
      <label class="block text-gray-200 mb-1">Nom court</label>
      <input
        v-model="form.shortName"
        type="text"
        class="w-full rounded px-3 py-2 bg-bg-dark text-white border border-gray-800"
      />
    </div>

    <button
      type="submit"
      class="w-full py-2 rounded bg-publish-button hover:bg-publish-button-hover text-white font-semibold cursor-pointer"
      :disabled="loading"
    >
      {{ loading ? 'Modification...' : 'Mettre à jour' }}
    </button>
  </form>
</template>
