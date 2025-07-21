<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Card from '../components/ui/Card.vue'
import CategoryList from '../components/CategoryList.vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from '../components/ui/SearchBar.vue'
import { getMostLikedPublicConversation, searchPublicConversations } from '../api/conversation'
import type { Conversation } from '../types/Conversation'
import Pagination from '../components/ui/Pagination.vue'

const route = useRoute()
const router = useRouter()

const selectedCategories = ref<string[]>([])
const searchQuery = ref<string>('')
const isLoading = ref<boolean>(false)
const publicConversations = ref<Conversation[]>([])
const mostLikedConversation = ref<Conversation[]>([])
const currentPage = ref<number>(1)
const convPerPage = 20
const totalConversations = ref<number>(0)
const totalPages = ref<Number>(1)

const loadConversations = async (
  title: string,
  categories: string[],
  page: number,
) => {
  try {
    isLoading.value = true
    const res = await searchPublicConversations(
      title,
      categories,
      page,
      convPerPage,
    )

    publicConversations.value = res.conversations.map((conversation: any) => ({
      ...conversation,
      author: conversation.content.interlocutor_name ?? 'Unknown',
    }))
    totalConversations.value = res.total
    totalPages.value = Math.ceil(res.total / convPerPage)
  } catch (error) {
    console.error('Erruer lors du chagement des conversations filtrées', error)
  } finally {
    isLoading.value = false
  }
}

const loadMostLikedConversations = async () => {
  try {
    isLoading.value = true
    const res = await getMostLikedPublicConversation()

    mostLikedConversation.value =
      res.map((conversation: any) => ({
        ...conversation,
        author: conversation.content.interlocutor_name ?? 'Unknown',
      }))
    } catch(error) {
      console.error('Erruer lors du chagement des conversations filtrées', error)
    } finally {
      isLoading.value = false
    }
}



watch(selectedCategories, async (newSelectedCategory) => {
  try {
    isLoading.value = true
    const query = {
      ...(newSelectedCategory.length > 0 && { category: newSelectedCategory }),
      ...(searchQuery.value && { title: searchQuery.value }),
      ...(currentPage.value > 1 && { page: currentPage.value }),
    }
    await router.replace({ query })
    await loadConversations(
      searchQuery.value,
      newSelectedCategory,
      currentPage.value,
    )
  } catch (error) {
    console.error('Erreur lors du chargement des conversations filtrées', error)
  } finally {
    isLoading.value = false
  }
})

watch(searchQuery, async (newQuery) => {
  try {
    isLoading.value = true
    const query = {
      ...(selectedCategories.value.length > 0 && {
        category: selectedCategories.value,
      }),
      ...(newQuery && { title: newQuery }),
      ...(currentPage.value > 1 && { page: currentPage.value }),
    }
    await router.replace({ query })
    await loadConversations(
      newQuery,
      selectedCategories.value,
      currentPage.value,
    )
    await loadMostLikedConversations()
  } catch (erorr) {
    console.error('Erreru lors du chargement ')
  } finally {
    isLoading.value = false
  }
})

watch(currentPage, async (newPage) => {
  try {
    isLoading.value = true
    const query = {
      ...(selectedCategories.value.length > 0 && {
        category: selectedCategories.value,
      }),
      ...(searchQuery.value && { title: searchQuery.value }),
      ...(newPage > 1 && { page: newPage }),
    }
    await router.replace({ query })
    await loadConversations(
      searchQuery.value,
      selectedCategories.value,
      newPage,
    )
  } catch (erorr) {
    console.error('Erreru lors du chargement ')
  } finally {
    isLoading.value = false
  }
})

onMounted(async () => {
  const queryCategories = route.query.category
  const queryTitle = route.query.title
  const queryPage = route.query.page
  if (queryCategories) {
    if (Array.isArray(queryCategories)) {
      selectedCategories.value = queryCategories as string[]
    } else {
      selectedCategories.value = [queryCategories as string]
    }
  } else {
    selectedCategories.value = []
  }

  if (queryTitle) {
    searchQuery.value = queryTitle as string
  } else {
    searchQuery.value = ''
  }

  if (queryPage) {
    currentPage.value = Number(queryPage)
  } else {
    currentPage.value = 1
  }
  console.log(publicConversations.value)

  await loadConversations(
    searchQuery.value,
    selectedCategories.value,
    currentPage.value,
  )
})
</script>

<template>
  <div>
    <header class="flex flex-col md:flex-row justify-between items-center m-4">
      <h1 class="text-xl text-white welcome-message-shadow max-md:mb-4">
        Bienvenue sur
        <span class="font-semibold text-main-color">TalkLab</span>
      </h1>
      <SearchBar v-model="searchQuery" />
    </header>

    <section class="p-4 flex flex-col gap-4">
      <CategoryList
        :selected-category="selectedCategories"
        @update:selected="selectedCategories = $event"
      />
      <div
        v-if="!isLoading && publicConversations.length === 0"
        class="text-white text-center mt-6"
      >
        <p>Aucune conversation trouvée pour les catégories sélectionnées.</p>
      </div>

      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mb-10 px-3.5"
      >
        <Card
          v-for="conversation in publicConversations"
          :key="'rec-' + conversation.id"
          :conversation="conversation"
          :isCanBeModified="false"
        />
      </div>

      <Pagination
        v-if="publicConversations.length > 0"
        v-model="currentPage"
        :total-items="totalConversations"
        :page-size="convPerPage"
      />
    </section>
  </div>
</template>
