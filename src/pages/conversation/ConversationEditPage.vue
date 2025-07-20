<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useConversationStore } from '../../stores/useConversationStore'
import ConversationSimulatorCreation from '../../components/ConversationSimulatorCreation.vue'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Mettre à jour une conversation',
  meta:[
    {name: 'robots', content: 'noindex, nofollow' },
  ]
})

const conversationStore = useConversationStore()
const route = useRoute()
const id = ref(parseInt(route.params.id as string))
onMounted(async () => {
  await conversationStore.fetchConversationById(id.value)
})
</script>
<template>
   <h1 class="text-2xl font-bold mb-4 p-2 text-white ">Modifier une conversation fake</h1>
  <ConversationSimulatorCreation />
</template>
