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
    class="max-md:overflow-x-auto max-md:scrollbar-hide md:flex md:justify-center"
  >
    <div
      class="max-md:flex max-md:gap-3 max-md:px-4 max-md:py-3 max-md:min-w-max md:flex md:flex-wrap md:items-center md:justify-center md:bg-card-bg md:rounded-2xl md:px-6 md:py-2 md:gap-2 md:max-w-4xl md:mx-auto"
    >
      <span
        v-for="category in categoriesStore.categories"
        :key="category.id"
        class="max-md:flex-shrink-0 md:flex md:items-center"
      >
        <button
          type="button"
          @click="toggleCategory(category.name)"
          :class="[
            'max-md:px-4 max-md:py-2 max-md:text-sm max-md:font-medium max-md:rounded-full max-md:whitespace-nowrap max-md:border max-md:transition-all max-md:duration-200 md:px-3 md:py-1 md:text-base md:font-normal md:rounded md:cursor-pointer md:transition-all md:duration-200',
            selectedCategories.includes(category.name)
              ? 'max-md:bg-main-color max-md:border-main-color max-md:text-white max-md:shadow-sm md:bg-main-color md:text-white'
              : 'max-md:bg-transparent max-md:border-border-auth-button max-md:text-text-primary max-md:hover:border-main-color max-md:hover:text-main-color md:hover:underline md:bg-transparent md:text-white md:hover:bg-main-color/10',
          ]"
        >
          {{ category.name }}
        </button>
      </span>
    </div>
  </div>
</template>
