<script setup lang="ts">
import ConversationList from "../../components/ConversationList.vue";
import {useHead} from '@vueuse/head';

useHead({
  title: 'Voir mes conversations',
  meta:[
    {name: 'robots', content: 'noindex, nofollow' },
  ]
})

</script>

<template>
  <div class="p-6 min-h-screen bg-[#12121f]">
    <h1 class="text-2xl font-semibold mb-4 text-white">Mes Conversations</h1>
    <ConversationList />
  </div>
  </template>