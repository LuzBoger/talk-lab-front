<script setup lang="ts">
import { computed, watch } from 'vue'
import Card from '../components/ui/Card.vue'
import { useConversationStore } from '../stores/useConversationStore'
import CategoryList from '../components/CategoryList.vue'
const conversationStore = useConversationStore()
const publicConversations = computed(
  () => conversationStore.publicConversations,
)
watch(
  publicConversations,
  (newValue) => {
    console.log('Public conversations updated:', newValue[0])
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between items-center m-4">
      <div class="text-xl text-white welcome-message-shadow">
        Bienvenue sur
        <span class="font-semibold text-main-color">TalkLabs</span>
      </div>
    </header>

    <section class="p-4 flex flex-col gap-4">
      <CategoryList />
      <div
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 px-3.5"
      >
        <Card
          v-for="(conversation, index) in publicConversations"
          :key="'rec-' + index"
          :conversation="conversation"
          :isCanBeModified="false"
        />
      </div>
    </section>
  </div>
</template>
