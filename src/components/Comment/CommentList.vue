<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCommentsByConversationId, addComment } from '../../api/comment';
import type { Comment } from '../../types/Comment';
import CommentWithReplies from './CommentWithReplies.vue';
import { CommentStatusEnum } from '../../enums/CommentStatusEnum';
import CommentForm from './CommentForm.vue';


const route = useRoute();
const conversationId = Number(route.params.id)
const comments = ref<Comment[]>([])
const error = ref<string>('')

const fetchComments = async () => {
    try {
        comments.value = await fetchCommentsByConversationId(conversationId)
    }catch (err) {
        error.value = "Erreur lors de la récuperation des commentaires.";
    }
}

const createNewComment = async (content: string) => {
    try {
        await addComment({
            content,
            conversationId,
            parentCommentId: null,
            status: CommentStatusEnum.VALIDATED
        })
        await fetchComments()
    }
    catch (err) {
        error.value = "Erreur lors de l'ajout du commentaire.";
    }
}

const onReply =(newReply: Comment, parentId: number) => {
    const parentComment = comments.value.find(c => c.id === parentId)
    if(parentComment) {
        if(!parentComment.childComments) {
            parentComment.childComments = []
        }
        parentComment.childComments = [...parentComment.childComments, newReply];
    }
}

onMounted(fetchComments)
</script>


<template>

    <div>
        <div v-if="comments.length === 0" class="text-gray-400 italic mt-4">
            <p>Aucun commentaire pour le moment. </p>
        </div>
        <h2 class="text-white text-lg mb-4">Commentaires</h2>
        <CommentForm label="Envoyer" @submit="createNewComment" />
        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>


        <CommentWithReplies v-for="comment in comments" :key="comment.id" :comment="comment" @reply-add="onReply" />
    </div>






</template>