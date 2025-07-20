import { ref } from 'vue'
import { getCategories } from '../api/category'
import type { Category } from '../types/Category'
import {toast} from 'vue3-toastify'
export function useCategories() {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      categories.value = await getCategories()
    } catch (e: any) {
      error.value = 'Erreur lors du chargement des catégories'
      toast.error(error.value)
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    fetchCategories,
    loading,
    error,
  }
}
