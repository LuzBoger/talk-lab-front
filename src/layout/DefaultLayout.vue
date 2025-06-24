<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { useAuthStore } from '../stores/useAuthStore';
import { computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter()
const route = useRoute()

const logout = async () => {
  await authStore.logout()
  router.push('/login');
};

const showSideBar = computed(() => {
  return !['/login', '/register'].includes(route.path)
})


</script>

<template>
  <div class="flex min-h-screen bg-bg-dark">
    <Sidebar v-if="showSideBar" @logout="logout"  />
    <div :class="showSideBar ? 'flex-1 overflow-y-auto h-screen' : 'w-full'">
      <router-view />
</div>
  </div>
</template>
