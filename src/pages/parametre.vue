<script setup lang="ts">
import {ref} from 'vue';
import  { disable2FA, enable2FA, config2FA } from '../api/twoFactor';
import QRCode from '../components/2FA/QRCode.vue';
import { useAuthStore } from '../stores/useAuthStore';
import Input from '../components/2FA/Input.vue';



const authStore = useAuthStore()

const secret = ref<string>("")
const url = ref<string>("")
const code = ref<string>("")
const isActive = ref<boolean>(false)


const generateSecret = async(): Promise<void> => {
    try {
        const getSecret = await config2FA();
        secret.value = getSecret.secret;
        url.value = getSecret.otpauth_url; 
        isActive.value = true
        console.log(getSecret.otpauth_url)
    } catch(error) {
        console.log(error)
    }
}

const activeTwoFactor = async (): Promise<void> => {
     try {

        if(!secret.value) {
            return
        }
        await enable2FA(secret.value, code.value)
        authStore.isTwoFactorEnable = true
        code.value =''
        isActive.value = false
    } catch(error) {
        console.error(error)
    }
}
 
const disableTwoFactor = async (): Promise<void> => {

    try{
        await disable2FA()
        authStore.isTwoFactorEnable = false
        secret.value = ""
        url.value = ""
        code.value = ""
        isActive.value = false
        
    } catch(error) {
        console.log(error)
    }
}
console.log(url.value)
</script>

<template>

<div class="max-w-4xl mx-auto p-6 text-white">
    <h1 class="text-2xl font-bold mb-6">Authentification à deux facteurs</h1>
      
    <div v-if="!isActive && !authStore.isTwoFactorEnable" class="flex items-center gap-4 mb-6">
        <span>2FA désactivée</span>
        <div class="w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 relative" :class="isActive ? 'bg-green-600' : 'bg-gray-500'" @click="generateSecret">
            <div class="absolute top-1 left-1 h-6 w-6 bg-white rounded-full transition-transform duration-300" :class="isActive ? 'translate-x-6' : ''"></div>
        </div>
    </div>
    


    <div v-if="isActive && !authStore.isTwoFactorEnable" class="bg-gray-800 rounded-xl shadow p-6 flex flex-col md:flex-row gap-6">
        <div class="flex-1">
            <p class="mb-4">Veuillez scannez ce Qr Code avec l'application GoogleAuthenticator</p>
            <QRCode :otp-auth-url="url" class="mb-4" />
            <p class="mt-4">Ou utilisez une clé de configuration avec l'application GoogleAuthneticator</p>
            <p class="font-mono text-lg bg-gray-700 p-2 rounded">{{ secret }}</p>
        </div>
        <div class="flex-1">
            <p class="mb-2">Entrez le code à 6 chiffres fournit par votre application</p>
            <Input v-model:code="code" />
            <button type="button" @click="activeTwoFactor" :disabled="code.length !== 6" class="mt-4 bg-grenn-600 rounded text-white ">
                Activer 2FA
            </button>
        </div>
    </div>

    <div v-if="authStore.isTwoFactorEnable" class="mt-6">
        <p class="mb-4">L'authentification à deux facteurs est activée sur votre compte</p>
        <div class="flex items-center gap-4">
            <span>2FA activée</span>
            <div class="w-14 h-8 bg-green-600 rounded-full cursor-pointer relative transition-colors duration-300 " @click="disableTwoFactor">
                <div class="absolute top-1 left-7  h-6 w-6 bg-white rounded-full transtion-transform duration-300 "></div>
            </div>
        </div>
    </div>

</div>
</template>