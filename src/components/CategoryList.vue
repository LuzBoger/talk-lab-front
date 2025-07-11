<script setup lang="ts">
import { useCategoryStore } from '../stores/useCategoryStore'
const categoriesStore = useCategoryStore()
</script>

<template>
  <div
    class="flex items-center bg-[#232234] rounded-2xl px-6 py-2 w-fit mx-auto"
  >
    <template
      v-for="(category, idx) in categoriesStore.categories"
      :key="category.id"
    >
      <router-link
        :to="`/categorie/${category.name}`"
        class="text-white px-3 py-1 text-base font-normal hover:underline"
      >
        {{ category.name }}
      </router-link>
      <!-- Ajoute le séparateur sauf pour le dernier élément -->
      <span
        v-if="idx < categoriesStore.categories.length - 1"
        class="h-12 border-r border-white opacity-30 mx-1"
      ></span>
    </template>
  </div>
</template>
