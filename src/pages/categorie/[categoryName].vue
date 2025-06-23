<script setup lang="ts">

import { ref, computed, watch, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { getPublicConversationByCategory } from '../../api/conversation';
import SearchBar from '../../components/ui/SearchBar.vue';
import ConversationsByCategory from '../../components/ConversationsByCategory.vue'
import Pagination from '../../components/ui/Pagination.vue';
import type {Category} from '../../types/Category';
import type {Conversation} from '../../types/Conversation'

const route = useRoute();
const categoryStore = useCategoryStore()
const categoryName = ref(route.params.categoryName as string | undefined)
const conversations = ref<Conversation[]>([])
const categories = ref<Category[]>([])
const searchConversation = ref('')
const currentPage = ref(1)
const nbConversationPerPage = 10

const category = computed(() => {
    return categoryStore.categories.find((c: Category) => c.name.toLowerCase() === categoryName.value?.toLowerCase())
})

const filteredConversationByCategory = computed(() => {
    if (!category.value) {return []}

    const allConversations = conversations.value.filter((c:Conversation) => c.categoriesId.some((cat: any) => cat.id === category.value?.id))

    if (!searchConversation.value) {
        return allConversations
    }

    return allConversations.filter(conversation =>
        conversation.title.toLowerCase().includes(searchConversation.value.toLowerCase())
    );
})

const paginatedConversations = computed(() => {
    const firstPage = (currentPage.value - 1)* nbConversationPerPage
    return filteredConversationByCategory.value.slice(firstPage, firstPage + nbConversationPerPage)
})

const fetchConversations = async (name: string) => {
    const category = categoryStore.categories.find((cat: Category) =>cat.name.toLowerCase() === name.toLowerCase())
    if (!category) {
        conversations.value = []
        categories.value = []
        return
    }

    try {
        conversations.value = await getPublicConversationByCategory(category.id)
    } catch(error) {
        console.error("Erreur lors de la recuperation des conversations publique pour la categorie séléectionnés", error)
        conversations.value = []
    }
  }
  watch(() => route.params.categoryName, (name) => {
    categoryName.value = name as string
    fetchConversations(categoryName.value)
  })


  onMounted(() => {
    if(categoryName.value) {
        fetchConversations(categoryName.value)
    }
  })
</script>


<template>
    <div class="p-6 space-y-6">
        <h1 class="text-2xl font-bold text-white text-center">
            Toutes les conversations de la cataégorie : {{ category?.name || 'Aucune catégorie trouvée'}}
        </h1>
        <div class="flex justify-center">
            <SearchBar v-model="searchConversation" />
        </div>

        <ConversationsByCategory :conversations="paginatedConversations" />
        <Pagination :modelValue="currentPage" :totalItems="filteredConversationByCategory.length" :pageSize="nbConversationPerPage" @update:modelValue="(p:any) => currentPage = p" />
    </div>
 
</template>