<script setup lang="ts">
import defaultAvatar from '../assets/images/defaultAvatar.png';
import type { Category } from '../types/Category';


const props = defineProps<{
  categories: Category[]
  conversations:any[]

}>()
const NB_CONV = 3

const filteredConversationByCategory = (categoryId: number) => {
  return props.conversations.filter((conversation: any) => conversation.categoriesId.some((cat: any) => cat.id === categoryId))
}

</script>

<template>
    <div v-for="category in props.categories" :key="category.id" class="mb-12 bg-gray-800 p-5 rounded-2xl shadow-lg ">
      <h2 class="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">{{ category.name }}</h2>
      <div v-if="filteredConversationByCategory(category.id).length === 0" class="text-gray-400 italic mb-4 text-center">Aucune conversation disponible pour cette catégorie</div>
      <div v-for="conversation in filteredConversationByCategory(category.id).slice(0, NB_CONV)" :key="conversation.id" class="p-4 mb-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition flex items-center justify-between space-x-4">
        <div class="flex items-center space-x-4">
          <img :src="conversation.content.interlocutor_avatar || defaultAvatar" alt="Avatar de l'interlocuteur" class="w-12 h-12 rounded-full border-2 border-blue-400 object-cover" loading="lazy">
          <div>
            <div class="font-semibold text-lg">{{ conversation.content.interlocutor_username || 'Utilisateur' }}</div>
          </div>
        </div>
      <router-link :to="`/conversation/${conversation.id}`" class="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium ">Visualiser</router-link>
    </div>

    <div class="text-center" v-if="filteredConversationByCategory(category.id).length > 0">
      <router-link :to="`/categorie/${category.name}`" class="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
        Voir plus
      </router-link>
    </div>
  </div>
</template>