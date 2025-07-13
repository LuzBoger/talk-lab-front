<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useConversationStore } from '../../stores/useConversationStore'
import ConversationSimulatorView from '../../components/ConversationSimulatorView.vue'
const conversationStore = useConversationStore()
const route = useRoute()
const id = ref(parseInt(route.params.id as string))
onMounted(async () => {
  await conversationStore.fetchConversationById(id.value)
})
</script>
<template>
  <div class="p-6">
    <ConversationSimulatorView />
  </div>
</template>
