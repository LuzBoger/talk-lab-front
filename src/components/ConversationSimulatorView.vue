<script setup lang="ts">
import { watch } from 'vue'
import { useConversationStore } from '../stores/useConversationStore'
import ConversationSimulatorPreview from './preview/ConversationSimulatorPreview.vue'
const conversationStore = useConversationStore()

watch(
  () => conversationStore.currentConversation,
  (newVal) => {
    console.log('currentConversation changed:', { newVal })
  },
  { immediate: true },
)
</script>
<template>
  <div>
    <ConversationSimulatorPreview
      v-if="conversationStore.currentConversation"
      :conversation="conversationStore.currentConversation"
      :canBeModified="false"
    />
  </div>
</template>
