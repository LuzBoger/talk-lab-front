<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getLikers } from '../../api/conversation'
import type { Likers } from '../../types/Likers'
import Pagination from '../ui/Pagination.vue'

const props = defineProps<{
  conversationId: number
  isModalOpen: boolean
}>()

const emit = defineEmits(['close'])

const likers = ref<Likers[]>([])
const currentPage = ref(1)
const userPerPage = 5

const fetchLikers = async () => {
  likers.value = await getLikers(props.conversationId)
}

const paginatedLikers = computed(() => {
  const start = (currentPage.value - 1) * userPerPage
  return likers.value.slice(start, start + userPerPage)
})

watch(
  () => props.isModalOpen,
  (newVal) => {
    if (newVal) {
      fetchLikers()
      currentPage.value = 1
    }
  },
)
</script>

<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-lg max-w-md w-full p-6 max-h-[70vh] overflow-auto"
    >
      <h2 class="text-xl font-bold mb-4">
        Personnes qui ont liké votre conversation
      </h2>
    </div>
    <ul>
      <li
        v-for="liker in paginatedLikers"
        :key="liker.id"
        class="border-b py-2"
      >
        {{ liker.username }}
      </li>
    </ul>
    <Pagination
      v-model="currentPage"
      :total-items="likers.length"
      :page-size="userPerPage"
    />
    <button
      @click="emit('close')"
      class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700"
    >
      Fermer
    </button>
  </div>
</template>
