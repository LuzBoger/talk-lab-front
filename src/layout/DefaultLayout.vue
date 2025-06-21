<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../types/User'
import authService from '../api/authService'
import Sidebar from '../components/Sidebar.vue'

const user = ref<User | null>(null)
const router = useRouter()

const logout = () => {
  authService.logout()
  user.value = null
  router.push('/login')
}

onMounted(() => {
  const currentUser = authService.getCurrentUser()
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
