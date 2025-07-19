<script setup lang="ts">

import { ref, } from 'vue';
import CommentActions from './CommentActions.vue';
import type { Comment } from '../../types/Comment';
import { editComment, deleteComment, reportComment, addComment } from '../../api/comment';
import { CommentStatusEnum } from '../../enums/CommentStatusEnum';
import { useAuthStore } from '../../stores/useAuthStore';
import CommentForm from './CommentForm.vue';


const authStore = useAuthStore();

const props = defineProps<{
    comment: Comment
}>()
const emit = defineEmits<{
    (e: 'reply-add', newReply: Comment, parentId: number): void
}>()


const isEditing = ref<boolean>(false)
const isReplying = ref<boolean>(false)
const editedContent = ref<string>(props.comment.content)
const error = ref<string>('')
const baseUrl = import.meta.env.VITE_BASE_URL


const userCanEdit = () => {
    return authStore.user?.id === props.comment.publisher.id
}

const userCanDelete = () => {
     const isOwner = authStore.user?.id === props.comment.publisher.id
     const isAdmin = authStore.user?.role?.includes('ROLE_ADMIN')
     return isOwner || isAdmin
}

const userCanReport = () => {
     const isNotOwner = authStore.user?.id !== props.comment.publisher.id
     const isAdmin = authStore.user?.role?.includes('ROLE_ADMIN')
     return isNotOwner && !isAdmin
}

const initiateEditComment = () => {
    isEditing.value = true
    editedContent.value = props.comment.content
    error.value = ''
}

const cancelEditComment = () => {
    isEditing.value = false
    error.value = ''
}


const saveEditComment = async (content: string) => {
    try {
        const updatedContent = await editComment(props.comment.id!, { ...props.comment, content });
        props.comment.content = updatedContent.content
        isEditing.value = false
    } catch(err) {
        error.value = "Erreur lors de la modfication du commentaire"
    }
}

const deleteOneComment = async () => {
    try {
        await deleteComment(props.comment.id!)
        props.comment.status = CommentStatusEnum.REJECTED;
    } catch(err) {
        error.value = 'Erreur lors de la suppression du commentaire';
    }
}

const reportOneComment = async () => {
    try {
        await reportComment(props.comment.id!)
    } catch(err) {
        error.value = 'Erreur lors du signalement du commentaire';
    }
}

const addReply = async (content: string) => {
    try {
        const newComment = await addComment({
            content,
            conversationId: props.comment.conversationId,
            parentCommentId: props.comment.id,
            status: CommentStatusEnum.VALIDATED,
        });
        emit('reply-add', newComment, props.comment.id!)
        isReplying.value = false
    } catch(err) {
        error.value = 'Erreur lors de l\'ajout de la réponse à un commentaire';
    }
}

const toggleReplyForm = () => {
    isReplying.value = !isReplying.value
}
</script>


<template>

    <div class="mb-4  rounded p-3 text-white">
        <div class="flex items-center space-x-2 mb-2">
            <img  v-if="props.comment.publisher.avatarUrl" :src=" `${baseUrl}${props.comment.publisher.avatarUrl}`" alt="avatar" class="w-8 h-8 rounded-full"
                />
            <strong>{{ props.comment.publisher.name }}</strong>
            <small class="text-gray-500 ml-auto">{{ props.comment.createdAt }}</small>
        </div>
        <div v-if="props.comment.status === 'rejected'">
            <p class="italic text-gray-400">Ce commentaire a été supprimé</p>
        </div>
        <div v-else>
            <div v-if="!isEditing">{{ props.comment.content }}</div>

            <CommentForm v-else :initial-content="editedContent" label="Enregistrer" @submit="saveEditComment"
                @cancel="cancelEditComment" />

            <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        </div>

        <CommentActions 
            :comment-id="props.comment.id!" 
            :is-comment-can-edit="userCanEdit()" 
            :is-comment-can-report="userCanReport()"
            :is-comment-can-delete="userCanDelete()" 
            :is-admin="authStore.user?.role?.includes('ROLE_ADMIN')"
            :is-owner="authStore.user?.id === props.comment.publisher.id"
            @edit="initiateEditComment" 
            @delete="deleteOneComment"
            @report="reportOneComment" />

        <button type="button" @click="toggleReplyForm" class="mt-2 text-sm">
            {{ isReplying ? 'Annuler la réponse' : 'Répondre' }}
        </button>

        <div v-if="isReplying" class="mt-2">
            <CommentForm label="Répondre" @submit="addReply" @cancel="toggleReplyForm" />
        </div>

        <div class="ml-6 mt-4" v-if="props.comment.childComments && props.comment.childComments.length">
            <CommentWithReplies v-for="child in props.comment.childComments" :key="child.id" :comment="child" @reply-add="emit('reply-add', $event, props.comment.id!)" />

        </div>




    </div>










</template>