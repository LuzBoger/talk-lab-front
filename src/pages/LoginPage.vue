<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/useAuthStore';
import LoginIcon from '../components/icon/LoginIcon.vue'
import ArrowIcon from '../components/icon/ArrowIcon.vue'
import GoogleIcon from '../components/icon/GoogleIcon.vue'
import LoadingSpinnerIcon from '../components/icon/LoadingSpinnerIcon.vue'
import TwoFactorModal from '../components/2FA/TwoFactorModal.vue';

const router = useRouter();
const authStore = useAuthStore()

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);
const showModalTwoFactor = ref(false)
const errorMessageModal = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
     await authStore.login({
      email: email.value,
      password: password.value,
    })

    if(authStore.isTwoFactorEnable) {
      showModalTwoFactor.value = true
      return
    }

    router.push('/')

    console.log('Connexion réussie')
  } catch (error: any) {
    console.error("Détails de l'erreur:", error)
    errorMessage.value = error.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}


const validateTotp = async (code: string) => {

  loading.value = true

  try {
    await authStore.verifyTotp(code)
    showModalTwoFactor.value = false
    router.push('/')
  }catch (error: any) {
    errorMessageModal.value = error.response?.data?.message || 'Code 2FA invalide'
  } finally {
    loading.value = false
  }

}

const closeModal = () => {
  showModalTwoFactor.value = false
  errorMessageModal.value = ''
}



</script>

<template>
  <div class="flex w-screen h-screen">
    <router-link
      to="/"
      class="absolute top-5 left-5 z-10 cursor-pointer transition duration-300 ease-in-out hover:scale-110"
    >
      <ArrowIcon :width="25" :height="25" fillColor="black" />
    </router-link>
    <div class="flex w-full h-full overflow-hidden">
      <!-- Cette section sera masquée sur les petits écrans -->
      <div
        class="flex-1 justify-center items-center bg-white border-r border-gray-300 hidden md:flex"
      >
        <LoginIcon />
      </div>
      <div
        class="flex-1 flex flex-col justify-center items-center bg-white relative overflow-y-auto w-full"
      >
        <div class="relative flex flex-col gap-4">
          <h1
            class="text-lg md:text-2xl font-semibold text-center text-gray-800 mb-2"
          >
            Connectez-vous à votre compte
          </h1>
          <p class="text-sm text-center text-gray-700 mb-4">
            Avec <span class="font-semibold">Google</span> ou par
            <span class="font-semibold">Email</span>, c'est rapide et simple.
          </p>

          <form class="w-full flex flex-col gap-3" @submit.prevent="login">
            <div
              v-if="errorMessage"
              class="bg-error-message-light text-error-message p-2 rounded text-center text-sm font-semibold"
            >
              {{ errorMessage }}
            </div>

            <div class="">
              <label
                for="email"
                class="block mb-1 text-gray-800 text-xs font-medium"
                >E-mail</label
              >
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="exemple@mail.com"
                required
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <div>
              <label
                for="password"
                class="block mb-1 text-gray-800 text-xs font-medium"
                >Mot de passe</label
              >
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="******"
                required
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <button
              type="submit"
              :disabled="loading || showModalTwoFactor"
              class="w-full p-2.5 bg-validate-button hover:bg-validate-button-hover text-white rounded-lg font-semibold text-sm mt-2.5 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
              <span v-if="loading" class="inline-block mr-2 align-middle">
                <LoadingSpinnerIcon
                  :className="'animate-spin h-5 w-5 text-white'"
                />
              </span>
              Se connecter
            </button>
          </form>

          <div class="text-center text-gray-900 relative font-semibold">Ou</div>

          <div class="flex justify-center">
            <GoogleIcon
              :width="60"
              :height="60"
              fillColor="none"
              :className="'transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer'"
            />
          </div>

          <p class="text-center mt-4 text-sm">
            Pas encore de compte ?
            <router-link
              to="/register"
              class="text-validate-button hover:text-validate-button-hover hover:underline underline-offset-2 no-underline font-medium"
              >S'inscrire</router-link
            >
          </p>
        </div>
      </div>
    </div>
   </div>
   <TwoFactorModal 
      v-if="showModalTwoFactor"
      :error-message="errorMessage"
      @confirm="validateTotp"
      @close="closeModal"
  />
  
</template>
