<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useConversationStore } from '../../stores/useConversationStore'
import ConversationSimulatorView from '../../components/ConversationSimulatorView.vue'
import CommentList from '../../components/Comment/CommentList.vue'
import LikeModal from '../../components/like/LikeModal.vue'
import Like from '../../components/like/Like.vue'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Visualisez vos conversation',
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
  <div class="p-6 flex flex-col gap-6">
    <ConversationSimulatorView />
    <Like :conversation-id="id">
      <template #modal="{isModalOpen, conversationId, close}">
        <LikeModal :is-modal-open="isModalOpen" :conversation-id="conversationId" @close="close" />
      </template>
    </Like>
    <CommentList />
  </div>
</template>
