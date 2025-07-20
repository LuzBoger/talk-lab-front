<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits(['confirm', 'cancel'])

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  },
)
</script>

<template>
  <div
    v-if="props.isVisible"
    class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50"
    :class="[props.isVisible ? 'opacity-100' : 'opacity-0']"
  >
    <div
      class="bg-bg-dark rounded-lg p-4 shadow-xl w-full max-w-md text-white"
      :class="[props.isVisible ? 'scale-100' : 'scale-80']"
    >
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-bold">Sauvegarder votre conversation</h2>
        <button
          @click="$emit('cancel')"
          type="button"
          class="bg-transparent border-none text-gray-200 cursor-pointer text-3xl"
        >
          &times;
        </button>
      </div>

      <div class="mb-6 text-gray-200 leading-relaxed">
        <p>
          Vous avez apporté des modifications à votre conversation. Voulez-vous
          les conserver ?
        </p>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          type="button"
          class="bg-gray-200 hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          Annuler
        </button>
        <button
          @click="$emit('confirm')"
          type="button"
          class="bg-main-color hover:bg-main-color-hover text-black px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>
