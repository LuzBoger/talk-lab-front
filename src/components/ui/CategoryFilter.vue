<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { Category } from '../../types/Category'

const props = defineProps<{
  categories: Category[]
  modelValue: number | ''
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | ''): void
}>()

const selectedCategory = ref<number | ''>(props.modelValue ?? '')

watch(selectedCategory, (val) => {
  emit('update:modelValue', val)
})
</script>

<template>
  <select
    v-model="selectedCategory"
    class="w-full p-3 mb-6 rounded-md bg-card-bg text-gray-100 focus:outline-none"
  >
    <option value="">Toutes les catégories</option>
    <option
      v-for="category in categories"
      :key="category.id"
      :value="category.id"
    >
      {{ category.name }}
    </option>
  </select>
</template>
