<script setup lang="ts">
import {ref} from 'vue';


const props = defineProps<{
    errorMessage?: string
}>()
const emit = defineEmits(['confirm', 'close'])

const code = ref<string>('')


const submitCode = () => {
    if(code.value.length !== 6 || !/^\d+$/.test(code.value)) {
        return 
    }

    emit('confirm', code.value)
}
</script>


<template>

    <div class="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50" @click.self="emit('close')">
        <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm space-y-4">
            <h2 class="text-lg font-semibold text-center">Authentification à deux facteurs (2FA)</h2>
            <p class="text-sm text-center">Veuillez entrer le code de vérification à 6 chiffres provenant de votre application GoogleAuthenticator</p>
            <input v-model="code" type="text" maxlength="6" class="w-full text-center p-2.5 border border-gray-300 rounded-md text-lg" />
            
            <div v-if="props.errorMessage" class="text-red-600 text-sm text-center">
                <p>{{  errorMessage }}</p>
            </div>
            
            <div class="flex justify-between gap-2">
                <button
                type="button"
                class="flex-1 py-2 bg-gray-300 text-black rounded"
                @click="submitCode"
                >
                Envoyer
                </button>
            </div>
        </div>
    </div>


</template>