<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router' 
import { useCategories } from '../../../composables/useCategories'
import { deleteCategory } from '../../../api/category'
import CategoryTable from '../../../components/admin/categories/CategoryTable.vue'
import type { Category } from '../../../types/Category'
import { toast } from 'vue3-toastify'

const { categories, loading, error, fetchCategories } = useCategories()

const router = useRouter()
const handleDeleteCategory = async (category: Category) => {
  try {
    await deleteCategory(category.id!)
    toast.success('Catégorie supprimée avec succès')
    fetchCategories()
  } catch (e) {
    toast.error('Erreur lors de la suppression')
    console.error(e)
  }
}
const handleEditCategory = (category: Category) => {
  router.push(`/admin/categories/${category.id}/edit`)
}

onMounted(() => {
  fetchCategories()
})

</script>

<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Gestion des Catégories</h1>
      <router-link
        to="/admin/categories/new"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
      >
        Ajouter une catégorie
      </router-link>
    </div>

    <div v-if="loading" class="text-gray-400">Chargement des catégories...</div>
    <div v-else>
      <CategoryTable
        :categories="categories"
        @editCategory="handleEditCategory"
        @deleteCategory="handleDeleteCategory"
      />

      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>
  </div>
</template>
