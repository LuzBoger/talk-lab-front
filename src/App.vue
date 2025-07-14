<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCategoryStore } from './stores/useCategoryStore'
import { useAuthStore } from './stores/useAuthStore'
import { useNotificationsStore } from './stores/useNotificationsStore'
import { useConversationStore } from './stores/useConversationStore'
import { useFavoritesStore } from './stores/useFavoritesStore'

const categoryStore = useCategoryStore()
const conversationStore = useConversationStore()
const notificationStore = useNotificationsStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

onMounted(async () => {
  await categoryStore.fetchCategories()
  await conversationStore.fetchPublicConversations()
  console.log(
    'Public conversation:',
  )
})

watch(
  () => authStore.isAuthenticated,
  async (newVal) => {
    if (newVal) {
      await notificationStore.loadAllNotifications()
      await favoritesStore.fetchFavorites()
    }
  },
  { immediate: true },
)
</script>

<template>
  <router-view></router-view>
</template>
