import { defineStore } from "pinia";
import {ref} from 'vue';
import type { Conversation } from "../types/Conversation";
import { addFavorite, getFavorites, removeFavorite } from "../api/favorites";



export const useFavoritesStore = defineStore('favorites', () => {
    const favorites = ref<Conversation[]>([])
    const count = ref(0)

    const fetchFavorites = async () => {
        const response = await getFavorites()
        favorites.value = response.conversations
        count.value = response.count
    }


    const addToFavorites = async (conversationId: number) => {
        await addFavorite(conversationId)
        await fetchFavorites()
    }

    const removeFromFavorites = async (conversationId: number) => {
        await removeFavorite(conversationId)
        await fetchFavorites()
    }

    const isFavorite = (conversationId: number) => {
        return favorites.value.some(c => c.id === conversationId)
    }

    return {favorites, count, fetchFavorites, addToFavorites, removeFromFavorites, isFavorite}
})