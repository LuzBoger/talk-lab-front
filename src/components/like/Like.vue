<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore';
import { getLikesCount, getLikers, addLike, removeLike } from '../../api/conversation';
import HandThumbUp from '../icon/HandThumbUp.vue';
import type { Likers } from '../../types/Likers';


const props = defineProps<{
    conversationId: number
}>()

const authStore = useAuthStore()
const likesCount = ref<number>(0)
const isLiked = ref<boolean>(false)
const likers = ref<Likers[]>([])
const error = ref<string>('')
const isModalOpen = ref<boolean>(false)

const currentUserId = computed(() => {
    return authStore.user?.id;
})


const fetchLikes = async () => {
    likesCount.value = await getLikesCount(props.conversationId)
    likers.value = await getLikers(props.conversationId)
    isLiked.value = likers.value.some((user) => user.id === currentUserId.value)
}


const toggleLike = async () => {
    if (!currentUserId.value) {
        return
    }
    try {
        if (isLiked.value) {
            await removeLike(props.conversationId)
        } else {
            await addLike(props.conversationId)
        }
        await fetchLikes()
    } catch (err) {
        error.value = 'Erreure lors de l\'ajout d\'un like ou dislike'

    }
}

const openModal = () => {
    isModalOpen.value = true
}
const closeModal = () => {
    isModalOpen.value = false
}



onMounted(async () => {
    await fetchLikes()
})
</script>
<template>
    <div class="flex items-center space-x-4">
        <button @click="toggleLike"  class="flex items-center space-x-1 text-white" type="button" :disabled="!currentUserId">
<HandThumbUp
  :filled="isLiked"
  :class="[isLiked ? 'text-green-500' : 'text-gray-400']"
/>
         <span v-if="currentUserId" @click.stop="openModal"
                class="text-sm text-gray-300 hover:text-white cursor-pointer">
                {{ likesCount }}
            </span>
            <span v-else class="text-sm text-gray-300 cursor-default">
                {{ likesCount }}
            </span>
        </button>
        <slot name="modal" :is-modal-open="isModalOpen" :conversation-id="props.conversationId" :close="closeModal"></slot>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
</template>
