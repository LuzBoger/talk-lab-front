<script setup lang="ts">
import {ref, defineEmits, watch, defineProps} from 'vue';


const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value:string): void
}>()

const searchValue = ref(props.modelValue ?? '')

watch(searchValue, (val) => {
    emit('update:modelValue',val)
})

watch(() => props.modelValue, (val) => {
  searchValue.value = val ?? '';
});


</script>

<template>

    <div class="flex items-center border border-green-500 rounded-full px-4 py-2 w-full max-w-md">
        <input
            type="search"
            v-model="searchValue"
            placeholder="Rechercher une conversation"
            class="flex-grow bg-transparent text-white focus:outline-none"
        >
    </div>
</template>