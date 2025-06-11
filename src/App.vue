<script setup lang="ts">
import { onMounted } from 'vue';
import { useNotificationsStore } from '../src/stores/useNotificationsStore';
import { useFavoriteStore } from '../src/stores/useFavoritesStore';

import { useAuthStore } from '../src/stores/useAuthStore';


const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const favoriteStore = useFavoriteStore();

onMounted(async () => {
   if (authStore.isAuthenticated) {
    notificationsStore.loadAllNotifications();
    favoriteStore.fetchFavorites();
  }
});
</script>

<template>

<router-view></router-view>
</template>
