<script setup lang="ts">


import {ref, watch} from 'vue';
import type { Category } from '../types/Category';


const props = defineProps<{
    selectedCategories: number[],
    categories: Category[],
    isVisible: boolean

}>()

const emit = defineEmits(['save', 'close']);

const selectedCategories = ref<number[]>([...props.selectedCategories])

const saveCategories = () => {
    emit('save', selectedCategories.value)
    emit('close')
}

const close = () => {
    emit('close')
}

const resetSelectedCategory = () => {
    selectedCategories.value = []
}

watch(() => props.isVisible, (newValue) => {
    if(newValue) {
        document.body.classList.add('overflow-hidden')
    } else {
        document.body.classList.remove('overflow-hidden')
    }
})
</script>


<template>
    <div v-if="props.isVisible" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 opacity-100" @click.self="close"         :class="[props.isVisible ? 'opacity-100' : 'opacity-0']">
>
        <div class=" bg-white rounded-lg p-6 shadow-lg w-full max-w-md" :class="[props.isVisible ? 'scale-100' : 'scale-80']">
            <h3 class="text-lg font-semibold mb-4">Sélectionnez une ou plusieurs cétégories</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto mb-6">
                <div v-for="category in categories" :key="category.id" class="flex items-center">
                    <input
                        type="checkbox"
                        :value="category.id"
                        v-model="selectedCategories"
                        class="mr-2"
                    >
                    <span>{{ category.name }}</span>
                </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    @click="resetSelectedCategory"
                    class="px-4 rounded border border-gray-300 text-sm text-gray-700 bg-blue-500"
                >
                Réinitiliser
                </button>
                <button
                    type="button"
                    @click="close"
                    class="px-4 rounded border border-gray-300 text-sm text-gray-700 bg-red-500"
                >
                Annuler
                </button>
                <button
                    type="button"
                    @click="saveCategories"
                    class="px-4 rounded border border-gray-300 text-sm text-gray-700 bg-green-500">
                    Enregistrer
                </button>

            </div>
        
        
        
        
        
        
        
        
        </div>


    </div>
</template>