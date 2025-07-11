<script setup lang="ts">
import {computed} from 'vue';
import {useFavoritesStore} from '../../stores/useFavoritesStore'
import FavoriteConversation from "../../components/FavoriteConversation.vue"

const favoriteStore = useFavoritesStore()
const nbFavorites = computed(() => favoriteStore.count)

</script>

<template>
    <div class="bg-[#12121f] min-h-screen p-4 sm:p-6 md:p-8">
        <h1 class="text-2xl font-semibold text-white mb-2">
            Mes Favoris ({{ nbFavorites }})
        </h1>
        <FavoriteConversation />
    </div>
    </template>