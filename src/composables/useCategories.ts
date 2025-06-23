import {ref} from 'vue';
import { getCategories } from '../api/category';
import type { Category } from '../types/Category';

export function useCategories() {
    const categories = ref<Category[]>([])


    const fetchCategories = async () => {

        try {
            categories.value = await getCategories()
        } catch(e) {
            console.log("Erreur lors du chargement des catégories")
        }

    }


    return {categories,fetchCategories}
}