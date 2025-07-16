<script setup lang="ts">
import { useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { computed } from 'vue'

const route = useRoute()

const showSideBar = computed(() => {
  return !['/login', '/register'].includes(route.path)
})
</script>

<template>
  <div class="flex min-h-screen bg-bg-dark">
    <Sidebar v-if="showSideBar" />
    <div :class="showSideBar ? 'flex-1 overflow-y-auto h-screen' : 'w-full'">
      <router-view />
    </div>
  </div>
</template>
