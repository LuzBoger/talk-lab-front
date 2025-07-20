<script setup lang="ts">
import type { Category } from '../../../types/Category';

defineProps<{
    categories: Category[]
}>()

const emit = defineEmits<{
    (e: 'editCategory', category: Category): void
    (e: 'deleteCategory', category: Category): void
}>()
</script>

<template>
    <div>
        <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-100">
                Liste des Catégories ({{ categories.length }})
            </h2>

        </div>
        <div class="bg-card-bg border border-gray-700 rounded-lg shadow overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-200">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="px-4 py-3 font-semibold">ID</th>
                        <th class="px-4 py-3 font-semibold">Nom</th>
                        <th class="px-4 py-3 font-semibold">Nom court</th>
                        <th class="px-4 py-3 font-semibold">Créé le</th>
                        <th class="px-4 py-3 font-semibold text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in categories" :key="category.id"
                        class="border-b border-gray-700 hover:bg-gray-700/30 transition">
                        <td class="px-4 py-3">{{ category.id }}</td>
                        <td class="px-4 py-3">{{ category.name }}</td>
                        <td class="px-4 py-3">{{ category.shortName }}</td>
                        <td class="px-4 py-3">{{ category.createdAt }}</td>
                        <td class="px-4 py-3">
                            <div class="flex flex-wrap gap-2 justify-end">
                                <button
                                    class="px-3 py-1 rounded bg-publish-button hover:bg-publish-button-hover cursor-pointer text-white font-semibold text-xs transition"
                                    @click="emit('editCategory', category)">
                                    Modifier
                                </button>
                                <button
                                    class="px-3 py-1 rounded bg-cancel-color hover:bg-cancel-hover cursor-pointer text-white font-semibold text-xs transition"
                                    @click="emit('deleteCategory', category)">
                                    Supprimer
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
