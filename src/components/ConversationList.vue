<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getConversationsByUser } from '../api/conversation'
import Pagination from './ui/Pagination.vue'
import type { Conversation } from '../types/Conversation'
import Card from './ui/Card.vue'
const conversations = ref<Conversation[]>([])
const currentPage = ref(1)
const pagesize = 8

const paginated = computed(() => {
  const start = (currentPage.value - 1) * pagesize
  return conversations.value.slice(start, start + pagesize)
})

onMounted(async () => {
  try {
    const response = await getConversationsByUser()
    conversations.value = response
    console.log(response)
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error)
  }
})
</script>
<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 px-3.5"
  >
    <Card
      v-for="conversation in paginated"
      :key="conversation.id"
      :conversation="conversation"
      :isCanBeModified="true"
    />
  </div>
  <Pagination
    v-if="conversations.length > 0"
    :modelValue="currentPage"
    :totalItems="conversations.length"
    :pageSize="pagesize"
    @update:modelValue="(pagesize) => (currentPage = pagesize)"
  />
</template>
