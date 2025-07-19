<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import { getLikers } from '../../api/conversation'; 
import type { Likers } from '../../types/Likers';
import Pagination from '../ui/Pagination.vue';

const props = defineProps<{

    conversationId: number
    isModalOpen: boolean
}>()

const emit = defineEmits(['close'])

const likers = ref<Likers[]>([])
const currentPage = ref(1)
const userPerPage = 5


const fetchLikers = async () => {
    likers.value = await getLikers(props.conversationId)
}

const paginatedLikers = computed(() => {
    const start = (currentPage.value -1 ) * userPerPage
    return likers.value.slice(start, start + userPerPage)
})


watch(() => props.isModalOpen, (newVal) => {
    if(newVal) {
        fetchLikers()
        currentPage.value = 1
    }
})
</script>


<template>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs" @click.self="emit('close')">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[70vh] overflow-auto">
            <h2 class="text-2xl font-semibold mb-4 text-center">Personnes qui ont liké la conversation</h2>
        <ul class="mb-4">
            <li v-for="liker in paginatedLikers" :key="liker.id" class="py-3">
                {{ liker.username }}
            </li>
        </ul>
        <Pagination v-model="currentPage" :total-items="likers.length" :page-size="userPerPage" pagination-color="text-black" class="mb-4 text-black"  />
        <button @click="emit('close')" type="button" class="w-full py-2 bg-red-600 text-white rounded transition">Fermer</button>
    </div>
    </div>

</template>