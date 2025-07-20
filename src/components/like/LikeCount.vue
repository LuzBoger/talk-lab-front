<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLikesCount } from '../../api/conversation'
import LikeModal from './LikeModal.vue'
import LikeIcon from '../icon/LikeIcon.vue'

const props = defineProps<{
  conversationId: number
}>()

const likesCount = ref<number>(0)
const isModalOpen = ref<boolean>(false)

const fetchLikeCount = async () => {
  likesCount.value = await getLikesCount(props.conversationId)
}

onMounted(() => {
  fetchLikeCount()
})
</script>

<template>
  <div
    class="flex items-center space-x-2 text-white cursor-pointer"
    @click="isModalOpen = true"
  >
    <LikeIcon
      :width="24"
      :height="24"
      :fillColor="'green'"
      className="w-5 h-5"
    />
    <span>{{ likesCount }}</span>

    <LikeModal
      :conversation-id="props.conversationId"
      :is-modal-open="isModalOpen"
      @close="isModalOpen = false"
    />
  </div>
</template>
