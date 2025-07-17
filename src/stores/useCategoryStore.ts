import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category } from "../types/Category";
import { getCategories } from "../api/category";

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<Category[]>([])

    const fetchCategories = async () => {
        try {
            const allCategories = await getCategories()
            categories.value = allCategories.sort((a,b) => a.name.localeCompare(b.name))
                console.log("Categories", categories.value)

        } catch(error) {
                  console.error('Erreur lors du chargement des catégories:', error)

        }

    }

            return {categories, fetchCategories}

})