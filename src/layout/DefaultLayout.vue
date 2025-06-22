<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../types/User';
import authService from '../api/authService';
import Sidebar from '../components/Sidebar.vue';

import { useAuthStore } from '../stores/useAuthStore';



const authStore = useAuthStore();

const user = ref<User | null>(null);
const router = useRouter();
const sidebarCollapsed = ref(false);

const logout = async () => {
  await authStore.logout()
  router.push('/login');
};


const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};



</script>

<template>
  <div class="flex min-h-screen bg-dark">
    <Sidebar 
      @sidebar-toggle="handleSidebarToggle" 
      @logout="logout"
    />
    
    <div class="flex-1 bg-[#1D1C31]" :class="{ 'ml-20': sidebarCollapsed, 'ml-305': !sidebarCollapsed }">
        <router-view />
    </div>
  </div>
</template>

<style scoped>

.ml-305 {
  margin-left: 305px;
}

.ml-20 {
  margin-left: 80px;
}


</style>