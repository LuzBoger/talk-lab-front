<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ConversationForm from '../components/ConversationForm.vue';

const route = useRoute();
const conversationId = ref<number>(parseInt(route.params.id as string));

onMounted(() => {
  console.log('ID de la conversation:', conversationId.value);
});
</script>

<template>
  <div class="flex justify-center items-center p-6">
    <ConversationForm :categories="1"  />
  </div>
</template>