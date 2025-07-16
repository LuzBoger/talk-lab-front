<script setup lang="ts">

const props = defineProps<{

    commentId: number
    isCommentCanEdit: boolean
    isCommentCanDelete: boolean
    isCommentCanReport: boolean
    
}>()


const emit = defineEmits<{
    (e: 'edit', commentId: number): void
    (e: 'delete', commentId: number): void
    (e: 'report', commentId: number): void
}>()


const onEdit = () => {
emit('edit', props.commentId)
}
const onDelete = () => {
emit('delete', props.commentId)
}
const onReport = () => {
emit('report', props.commentId)
}
</script>

<template>
    <div class="flex space-x-4 text-sm text-white">
        <button v-if="isCommentCanEdit" type="button" @click="onEdit" class="hover:underline">Modifier</button>
        <button v-if="isCommentCanDelete" type="button" @click="onDelete" class="hover:underline">Supprimer</button>
        <button v-if="isCommentCanReport" type="button" @click="onReport" class="hover:underline">Signaler</button>

    </div>


</template>