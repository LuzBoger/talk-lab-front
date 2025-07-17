<script setup lang="ts">

import {computed} from 'vue';

const props = defineProps<{
    modelValue: number
    totalItems: number
    pageSize: number
}>()

const emit = defineEmits(['update:modelValue'])

const currentPage = computed(()=> {
    return props.modelValue
})

const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.pageSize);
});

const precedentPage = () => {
    if (currentPage.value > 1) {
        emit('update:modelValue', currentPage.value - 1);
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        emit('update:modelValue', currentPage.value + 1);
    }
};

const showNbPage = computed(() => {
    const pages = []
    const total = totalPages.value;
   
    if(total <= 7) {
        for(let i = 1; i <= total; i++) {
            pages.push(i);
        } 

    } else {
        pages.push(1);
        if (currentPage.value > 4) {
            pages.push('...');
        }

        const start = Math.max(2, currentPage.value - 1);
        const end = Math.min(total - 1, currentPage.value + 1);

        for(let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (currentPage.value < total - 3) {
            pages.push('...');
        }
        pages.push(total);

    }
    return pages;
})
</script>

<template>
    <div class="flex justify-center mt-6">
        <button
            type="button"
            @click="precedentPage"
            :disabled="currentPage === 1"
            class="flex items-center justify-center px-4 py-2 mx-1 text-gray-500  rounded-md disabled:cursor-not-allowed"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </button>
        <div v-for="page in showNbPage" :key="page" class="flex items-center">
            <span v-if="page === '...'" class="px-4 py-2 rounded-md">
                ...
            </span>
            <button
                 v-else
                @click="$emit('update:modelValue', page)"
                :class="[
                'px-4 py-2 transition-colors transform rounded-md',
                page === currentPage
                    ? 'text-white'
                    : 'text-gray-700'
                ]"
            >
                {{ page }}
            </button>
        </div>
        <button
            type="button"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center px-4 py-2 mx-1 text-gray-500  rounded-md disabled:cursor-not-allowed"
        >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        </button>





    </div>
</template>