<script setup lang="ts">

import { watch } from 'vue';

const props = defineProps<{
    isVisible: boolean
}>()

const emit = defineEmits(
    ['confirm', 'cancel']
)

watch(() => props.isVisible, (newValue) => {
    if(newValue) {
        document.body.classList.add('overflow-hidden')
    } else {
        document.body.classList.remove('overflow-hidden')
    }
})

</script>

<template>
    <div v-if="props.isVisible" class="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50"
        :class="[props.isVisible ? 'opacity-100' : 'opacity-0']">
        <div class="bg-white rounded-lg p-8 shadow-xl w-full max-w-md"
            :class="[props.isVisible ? 'scale-100' : 'scale-80']">
            
            <div class="flex justify-between items-center mb-5">
                <h2 class="text-lg font-bold text-gray-800">Sauvegarder votre conversation</h2>
                <button @click="$emit('cancel')" class="bg-transparent border-none text-2xl text-gray-400 cursor-pointer">
                    &times;
                </button>
            </div>
            
            <div class="mb-6 text-gray-600 leading-relaxed">
                <p>Vous avez apporté des modifications à votre conversation. Voulez-vous les conserver ?</p>
            </div>

            <div class="flex justify-end space-x-3">
                <button @click="$emit('cancel')" class="bg-gray-100 text-gray-800 px-4 py-2 rounded text-sm">Annuler</button>
                <button @click="$emit('confirm')" class="bg-green-600 text-white px-4 py-2 rounded text-sm">Confirmer</button>
            </div> 
        </div>
    </div>
</template>