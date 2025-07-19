<script setup lang="ts">

import {ref,watch} from 'vue';

const props = defineProps<{
    initialContent?: string;
    label: string;
    disabled?: boolean;
}>()

const emit = defineEmits<{

    (e: 'submit', content: string): void
    (e: 'cancel'): void

}>()


const content = ref<string>(props.initialContent ?? '')

watch(() => props.initialContent, (newContent) => {
    content.value = newContent ?? ''
})

const onSubmit = () => {
    if(content.value.trim() === '') {
        return
    }
    emit('submit', content.value.trim())
}

const onCancel = () => {
    emit('cancel')
}
</script>

<template>
    <div class="mb-4">
        <textarea
            v-model="content"
            rows="4"
            placeholder="Ecrivez un commentaire pour la conversation...."
            class="w-full border rounded p-2 text-white">
        </textarea>
        <div class="mt-2 flex space-x-2">
            <button
                type="button"
                @click="onSubmit"
                :disabled="disabled || content.trim() === ''"
                class="bg-green-600 px-4 py-2 rounded">

                {{ props.label }}
            
            </button>
            <button
                type="button"
                @click="onCancel"
                class="bg-red-600 px-4 py-2 border rounded">
                Annuler
            </button>
        </div>
    </div>





</template>


