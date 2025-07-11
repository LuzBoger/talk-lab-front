<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ConversationSimulator from '../components/ConversationSimulator.vue'

const route = useRoute()
const conversationId = ref<number>(parseInt(route.params.id as string))

onMounted(() => {
  console.log('ID de la conversation:', conversationId.value)
})
</script>

<template>
  <div class="flex justify-center items-center p-6">
    <ConversationSimulator />
  </div>
</template>
