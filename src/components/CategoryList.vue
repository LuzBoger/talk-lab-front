<script setup lang="ts">
import { useCategoryStore } from '../stores/useCategoryStore';
const categoriesStore = useCategoryStore()

</script>

<template>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <router-link
             v-for="category in categoriesStore.categories"
             :key="category.id"
             :to="`/categorie/${category.name}`"
             class="bg-gray-800 text-white transition rounded-xl p-4 text-center shadow">
                {{ category.name }}
            </router-link>
        </div>
</template>