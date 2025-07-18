<script setup lang="ts">
import { computed } from 'vue'
import { useCategoryStore } from '../stores/useCategoryStore'

const props = defineProps<{
  selectedCategory: string[]
}>()

const emit = defineEmits<{
  (event: 'update:selected', value: string[]): void
}>()

const categoriesStore = useCategoryStore()

const selectedCategories = computed(() => {
  return props.selectedCategory
})

const toggleCategory = (categoryName: string) => {
  const updatedSelectCategories = [...props.selectedCategory]
  const index = updatedSelectCategories.indexOf(categoryName)

  if (index === -1) {
    updatedSelectCategories.push(categoryName)
  } else {
    updatedSelectCategories.splice(index, 1)
  }
  emit('update:selected', updatedSelectCategories)
}
</script>

<template>
  <div
    class="flex items-center bg-[#232234] rounded-2xl px-6 py-2 w-fit mx-auto"
  >
    <span
      v-for="category in categoriesStore.categories"
      :key="category.id"
      class="flex items-center"
    >
      <button
        type="button"
        @click="toggleCategory(category.name)"
        :class="[
          'px-3 py-1 text-base font-normal rounded cursor-pointer',
          selectedCategories.includes(category.name)
            ? 'bg-main-color'
            : 'hover:underline bg-transparent text-white',
        ]"
      >
        {{ category.name }}
      </button>
    </span>
  </div>
</template>
