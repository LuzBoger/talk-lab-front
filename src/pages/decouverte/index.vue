<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConversationStore } from '../../stores/useConversationStore'
import { useCategoryStore } from '../../stores/useCategoryStore'
import ConversationPublic from '../../components/ConversationPublic.vue'
import CategoryFilter from '../../components/ui/CategoryFilter.vue'
import type { Category } from '../../types/Category'

const conversationStore = useConversationStore()
const categoriesStore = useCategoryStore()

const selectedCategory = ref<number | ''>('')

const categories = computed(() => {
  return categoriesStore.categories || []
})
const allPublicConversations = computed(() => {
  console.log(console.log(conversationStore.publicConversations))
  return conversationStore.publicConversations || []
})
console.log(allPublicConversations.value)

const filteredConversation = computed(() => {
  return allPublicConversations.value.filter((conversation) => {
    const matchesCategory = selectedCategory.value
      ? conversation.categoriesId.some(
          (category: any) => category.id === selectedCategory.value,
        )
      : true
    return matchesCategory
  })
})

const filteredCategories = computed(() => {
  return selectedCategory.value
    ? categories.value.filter(
        (category: Category) => category.id === selectedCategory.value,
      )
    : categories.value
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 text-white">
    <h1 class="text-3xl font-extrabold mb-10 text-center">
      Découvrez divers conversations partagées
    </h1>
    <div class="flex flex-col md:flex-row gap-4 mb-8">
      <CategoryFilter :categories="categories" v-model="selectedCategory" />
    </div>

    <ConversationPublic
      :categories="filteredCategories"
      :conversations="filteredConversation"
    />
  </div>
</template>
