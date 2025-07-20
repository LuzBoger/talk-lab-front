<script setup lang="ts">
import ConversationSimulatorCreation from '../../components/ConversationSimulatorCreation.vue'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Créer une conversation',
  meta:[
    {name: 'description', content: 'Créez votre conversation fictive ou réaliste avec notre simulateur en ligne.'},
    {name: 'robots', content: 'noindex, nofollow' },
    {property: 'og:description', content: 'Créez votre conversation fictive ou réaliste avec notre simulateur en ligne.'},
    { name: 'twitter:description', content:'Créez votre conversation fictive ou réaliste avec notre simulateur en ligne.' },
  ]
})


</script>
<template>
    <h1 class="text-2xl font-bold mb-4 p-2 text-white ">Création d'une fake conversation</h1>
    <ConversationSimulatorCreation />
</template>
