<script setup lang="ts">
import { useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import { ref, computed } from 'vue'
import { useHead } from '@vueuse/head'
const route = useRoute()

const baseUrl = import.meta.env.VITE_BASE_URL
const pageTitle = ref<string>('Créez des fake conversations avec notre simulateur')
const fullUrl = computed(() => `${baseUrl}${route.fullPath}`)

const showSideBar = computed(() => {
  return !['/login', '/register', '/accueil'].includes(route.path)
})

useHead(() => ({
  titleTemplate: (title: string) => (title ? `${title} | TalkLab` : 'TalkLab'),
  title: pageTitle.value,
  meta: [
    {
      name: 'description',
      content:
        'TalkLab est un simulateur en ligne pour créer des conversations fictives ou réalistes sur mobile tout en choissisant votre réseaux sociaux favoris.',
    },
    {
      name: 'keywords',
      content:
        'TalkLab, fake conversation, fausses conversations, fictives, réaliste, simulateur en ligne, créer conversations, conversation, fake , réseaux sociaux',
    },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'robots', content: 'index, follow' },
    { httpEquiv: 'Content-Language', content: 'fr' },
    { property: 'og:url', content: fullUrl.value },
    { property: 'og:title', content: pageTitle.value },
    {
      property: 'og:description',
      content:
        'TalkLab est un simulateur en ligne pour créer des conversations fictives ou réalistes',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '../../public/logo.svg' },
    { name: 'twitter:card', content: '../../public/logo.svg' },
    { name: 'twitter:title', content: pageTitle.value },
    {
      name: 'twitter:description',
      content:
        'TalkLab est un simulateur en ligne pour créer des conversations fictives ou réalistes',
    },
    { name: 'twitter:image', content: '../../public/logo.svg' },
  ],
  link: [
    { rel: 'icon', href: '../../public/logo.svg' },
    { rel: 'canonical', href: fullUrl },
  ],
}))
</script>

<template>
  <div class="flex min-h-screen bg-bg-dark">
    <Sidebar v-if="showSideBar" />
    <div
      :class="
        showSideBar
          ? 'flex-1 overflow-y-auto h-screen max-md:pb-16 md:pb-0'
          : 'w-full'
      "
    >
      <router-view />
    </div>
  </div>
</template>
