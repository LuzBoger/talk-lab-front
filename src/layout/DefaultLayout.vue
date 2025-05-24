<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '../types/User';
import authService from '../api/authService';
import Sidebar from '../components/Sidebar.vue';

const user = ref<User | null>(null);
const router = useRouter();
const sidebarCollapsed = ref(false);

const logout = () => {
  authService.logout();
  user.value = null;
  router.push('/login');
};


const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};




onMounted(() => {
  const currentUser = authService.getCurrentUser();
  if (currentUser) {
    user.value = currentUser;
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-dark">
    <Sidebar 
      @sidebar-toggle="handleSidebarToggle" 
      @logout="logout"
      :isLoggedIn="!!user"
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