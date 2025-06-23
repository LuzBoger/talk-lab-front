<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../types/User'
import Sidebar from '../components/Sidebar.vue'
import { useAuthStore } from '../stores/useAuthStore';

const authStore = useAuthStore();
const user = ref<User | null>(null)
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login');
};

onMounted(() => {
  const currentUser = authStore.getCurrentUser()
  if (currentUser) {
    user.value = currentUser
  }
})
</script>

<template>
  <div class="flex">
    <Sidebar @logout="logout" :isLoggedIn="!!user" />
    <div class="flex flex-1 bg-[#1D1C31]">
      <router-view />
    </div>
  </div>
</template>
