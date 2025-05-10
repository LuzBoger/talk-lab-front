<script setup lang="ts">
import { useRoute } from 'vue-router';
import ConversationForm from '../components/ConversationForm.vue';

const route = useRoute();


</script>

<template>
  <div class="flex justify-center items-center p-6">
    <ConversationForm :categories="1"  />
  </div>
</template>