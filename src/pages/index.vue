<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Card from '../components/ui/Card.vue'

const isSearchOpen = ref(false)
const searchQuery = ref('')
const sampleImage = 'https://picsum.photos/350/236'
const sampleTags = [
  { text: 'NOV', color: 'yellow' },
  { text: 'SFF', color: 'green' },
  { text: 'APO', color: 'red' },
  { text: 'CYB', color: 'purple' },
]

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    nextTick(() => {
      const searchInput = document.querySelector('.search-bar input')
      if (searchInput) (searchInput as HTMLInputElement).focus()
    })
  }
}
</script>

<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between items-center mb-7">
      <div class="text-xl text-white welcome-message-shadow">
        Bienvenue sur <span class="font-semibold text-[#23CE6B]">TalkLabs</span>
      </div>
      <div class="flex items-center w-full md:w-auto mt-4 md:mt-0">
        <div class="flex flex-1 max-w-xs md:max-w-sm">
          <input
            type="text"
            placeholder="Rechercher..."
            v-model="searchQuery"
            class="flex-1 px-4 py-3 border-none rounded-l-2xl text-sm outline-none"
          />
          <button
            class="bg-[#23CE6B] border-none rounded-r-2xl py-3 px-4 transition-colors duration-300 ease-in-out hover:bg-[#1eae5a]"
            @click="toggleSearch"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.1333 24L13.7333 15.6C13.0667 16.1333 12.3 16.5556 11.4333 16.8667C10.5667 17.1778 9.64445 17.3333 8.66667 17.3333C6.24444 17.3333 4.19444 16.4944 2.51667 14.8167C0.838889 13.1389 0 11.0889 0 8.66667C0 6.24444 0.838889 4.19444 2.51667 2.51667C4.19444 0.838889 6.24444 0 8.66667 0C11.0889 0 13.1389 0.838889 14.8167 2.51667C16.4944 4.19444 17.3333 6.24444 17.3333 8.66667C17.3333 9.64445 17.1778 10.5667 16.8667 11.4333C16.5556 12.3 16.1333 13.0667 15.6 13.7333L24 22.1333L22.1333 24ZM8.66667 14.6667C10.3333 14.6667 11.75 14.0833 12.9167 12.9167C14.0833 11.75 14.6667 10.3333 14.6667 8.66667C14.6667 7 14.0833 5.58333 12.9167 4.41667C11.75 3.25 10.3333 2.66667 8.66667 2.66667C7 2.66667 5.58333 3.25 4.41667 4.41667C3.25 5.58333 2.66667 7 2.66667 8.66667C2.66667 10.3333 3.25 11.75 4.41667 12.9167C5.58333 14.0833 7 14.6667 8.66667 14.6667Z"
                fill="#121212"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <section>
      <h2 class="text-2xl font-semibold text-[#23CE6B] mb-5 mt-10 px-3.5">
        Recommandations
      </h2>
      <div
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 px-3.5"
      >
        <Card
          v-for="i in 4"
          :key="'rec-' + i"
          :image-url="sampleImage"
          title="Une dispute qui tourne au vinaigre"
          author="Sid-Ahmed"
          :tags="sampleTags"
        />
      </div>
    </section>

    <section>
      <h2 class="text-2xl font-semibold text-[#23CE6B] mb-5 mt-10 px-3.5">
        Populaire
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10 px-3.5"
      >
        <Card
          v-for="i in 4"
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
