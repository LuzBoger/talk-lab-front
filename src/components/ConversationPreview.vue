<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    title: string;
    content: any;
    createdAt: string;
    updatedAt: string;
}>();

const fomattedTime = computed(() => {
    const date = new Date(props.createdAt);
    return date.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
})

</script>

<template>
  <div class="w-[360px] mx-auto bg-gray-100 p-4 rounded-lg shadow-md">
    <div class="flex justify-between text-xs text-gray-600 mb-2">
      <span>{{ fomattedTime }}</span>
      <div class="flex space-x-2">
        <span>{{ content.network_type }}</span>
        <span>{{ content.battery_level }}%</span>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-4 text-sm">
      <h3 class="font-semibold text-gray-800 mb-2">Conversaiton</h3>

      <div class="flex items-center space-x-3 mb-4">
        <img :src="content.interlocutor_avatar_url" alt="avatar" class="w-10 h-10 rounded-full object-cover" />
        <div>
          <p class="text-sm font-medium text-gray-900">{{ content.interlocutor_name }}</p>
          <p class="text-xs text-gray-500">{{ content.interlocutor_username }}</p>
        </div>
      </div>

      <div class="bg-gray-200 rounded-lg p-2 mb-2">
        <p class="text-gray-900">{{ content.message }}</p>
      </div>

      <div class="mt-4">
        <button class="w-full bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700 text-xs">
          Télécharger la conversation
        </button>
      </div>
    </div>
  </div>
</template>

