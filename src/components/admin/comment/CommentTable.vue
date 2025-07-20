<script setup lang="ts">
import type { Comment } from '../../../types/comment/Comment';

defineProps<{
    comments: Comment[]
}>()

const emit = defineEmits<{
    (e: 'accept', comment: Comment): void
    (e: 'reject', comment: Comment): void
}>()
</script>

<template>
    <div>
        <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-100">
                Commentaires ({{ comments.length }})
            </h2>

        </div>
        <div class="bg-card-bg border border-gray-700 rounded-lg shadow overflow-x-auto">
            <table class="min-w-full text-sm text-left text-gray-200">
                <thead>
                    <tr class="border-b border-gray-700">
                                  <th class="px-4 py-3 font-semibold">ID</th>
                                  <th class="px-4 py-3 font-semibold">Auteur</th>
                                  <th class="px-4 py-3 font-semibold">Contenu</th>
                                  <th class="px-4 py-3 font-semibold">Status</th>
                                  <th class="px-4 py-3 font-semibold">Créé le</th>
                                  <th class="px-4 py-3 font-semibold text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="comment in comments" :key="comment.id"
                        class="border-b border-gray-700 hover:bg-gray-700/30 transition">
                        <td class="px-4 py-3">{{ comment.id }}</td>
                        <td class="px-4 py-3">{{ comment.publisher.username ?? 'Inconnu' }}</td>
                        <td class="px-4 py-3">{{ comment.content }}</td>
                        <td class="px-4 py-3">{{ comment.status }}</td>
                        <td class="px-4 py-3">{{ comment.createdAt }}</td>
                        <td class="px-4 py-3">
                            <div class="flex flex-wrap gap-2 justify-end">
                                <button
                                    class="px-3 py-1 rounded bg-publish-button hover:bg-publish-button-hover cursor-pointer text-white font-semibold text-xs transition"
                                    @click="emit('accept', comment)">
                                    Accepter
                                </button>
                                <button
                                    class="px-3 py-1 rounded bg-cancel-color hover:bg-cancel-hover cursor-pointer text-white font-semibold text-xs transition"
                                    @click="emit('reject', comment)">
                                    Refuser
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
