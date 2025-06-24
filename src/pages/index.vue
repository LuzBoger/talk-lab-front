<script setup lang="ts">
import Card from '../components/ui/Card.vue'

const sampleImage = 'https://picsum.photos/350/236'
const sampleTags = [
  { text: 'NOV', color: 'yellow' },
  { text: 'SFF', color: 'green' },
  { text: 'APO', color: 'red' },
  { text: 'CYB', color: 'purple' },
]
</script>

<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between items-center m-4">
      <div class="text-xl text-white welcome-message-shadow">
        Bienvenue sur
        <span class="font-semibold text-main-color">TalkLabs</span>
      </div>
    </header>

    <section>
      <h2 class="text-2xl font-semibold text-main-color m-4 mt-10 px-3.5">
        Recommandations
      </h2>
      <div
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 px-3.5"
      >
        <Card
          v-for="i in 3"
          :key="'rec-' + i"
          :image-url="sampleImage"
          title="Une dispute qui tourne au vinaigre"
          author="Sid-Ahmed"
          :tags="sampleTags"
        />
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-main-color m-4 mt-10 px-3.5">
        Populaire
      </h2>
      <div
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 px-3.5"
      >
        <Card
          v-for="i in 3"
          :key="'pop-' + i"
          :image-url="sampleImage"
          title="Une dispute qui tourne au vinaigre"
          author="Sid-Ahmed"
          :tags="sampleTags"
        />
      </div>
    </section>
  </div>
</template>
