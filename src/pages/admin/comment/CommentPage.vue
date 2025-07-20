<script setup lang="ts">
import {ref, onMounted} from 'vue'
import { getPendingComments, validateComment, rejectComment } from '../../../api/comment';
import type {Comment} from '../../../types/comment/Comment';
import CommentTable from '../../../components/admin/comment/CommentTable.vue';
import {toast} from 'vue3-toastify'

const comments = ref<Comment[]>([])
const loading = ref<boolean>(false)
const errorMessage = ref<string>('')

const fetchPendingComments = async () => {
    loading.value = true
    errorMessage.value = ''

    try {
        comments.value = await getPendingComments()
    } catch (err: any) {
        errorMessage.value = err.response?.data?.error || err.message || 'Erreur inconnue'
    } finally {
        loading.value = false
    }   
}

const handleAccept = async (comment: Comment) => {
    try {
        const response = await validateComment(comment.id!)
        toast.success(response.message || 'Vous avez validé le commentaire!')
        await fetchPendingComments()
    } catch (err: any) {
    const msg = err.response?.data?.error || err.message || 'Erreur lors de la validation'
    toast.error(msg)
  }
}

const handleReject = async (comment: Comment) => {
    try {
        const response = await rejectComment(comment.id!)
        toast.success(response.message || 'Vous avez rejeté le commentaire réussie !')
        await fetchPendingComments()
    } catch (err: any) {
    const msg = err.response?.data?.error || err.message || 'Erreur lors de la validation'
    toast.error(msg)
  }
}

onMounted(() => {
    fetchPendingComments()
})
</script>
<template>
  <div class="max-w-5xl mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Gestion des Commentaires</h1>
    </div>

    <div v-if="loading" class="text-gray-400">Chargement des commentaires...</div>
    <div v-else>
      <CommentTable
        :comments="comments"
        @accept="handleAccept"
        @reject="handleReject"
      />

      <div v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</div>
    </div>
  </div>
</template>


