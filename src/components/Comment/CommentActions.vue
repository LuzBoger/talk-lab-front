<script setup lang="ts">
const props = defineProps<{
  commentId: number
  isCommentCanEdit: boolean
  isCommentCanDelete: boolean
  isCommentCanReport: boolean
  isAdmin?: boolean
  isOwner?: boolean
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
  <div class="flex justify-end space-x-4 text-sm text-white">
    <button
      v-if="isCommentCanEdit"
      type="button"
      @click="onEdit"
      class="cursor-pointer text-white bg-publish-button hover:bg-publish-button-hover px-2 py-1 rounded"
    >
      Modifier
    </button>
    <button
      v-if="isCommentCanDelete"
      type="button"
      @click="onDelete"
      class="cursor-pointer text-white bg-cancel-color hover:bg-cancel-hover px-2 py-1 rounded"
      :title="isAdmin && !isOwner ? 'Supprimer en tant qu\'admin' : 'Supprimer'"
    >
      {{ isAdmin && !isOwner ? 'Supprimer (Admin)' : 'Supprimer' }}
    </button>
    <button
      v-if="isCommentCanReport"
      type="button"
      @click="onReport"
      class="cursor-pointer text-white bg-cancel-color hover:bg-cancel-hover px-2 py-1 rounded"
    >
      Signaler
    </button>
  </div>
  <div class="flex space-x-4 text-sm text-white">

    <button
      v-if="isCommentCanReport"
      type="button"
      @click="onReport"
      class="cursor-pointer text-white bg-cancel-color hover:bg-cancel-hover px-2 py-1 rounded"
    >
      Signaler
    </button>
  </div>
</template>
