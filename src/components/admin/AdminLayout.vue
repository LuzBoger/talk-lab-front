<template>
  <div class="admin-layout">
    <nav class="navbar navbar-dark bg-dark">
      <div class="container">
        <span class="navbar-brand">TalkLabs Admin</span>
      </div>
    </nav>

    <div class="container py-4">
      <p class="text-secondary">Message de test : Le layout admin fonctionne</p>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AdminLayout'
});
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}
</style> 