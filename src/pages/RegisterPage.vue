<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterIcon from '../components/icon/RegisterIcon.vue'
import GoogleIcon from '../components/icon/GoogleIcon.vue'
import LoadingSpinnerIcon from '../components/icon/LoadingSpinnerIcon.vue'
import ArrowIcon from '../components/icon/ArrowIcon.vue'

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()

const register = async () => {
  if (
    !name.value ||
    !username.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // Remplacez par votre logique d'inscription
    console.log('Inscription réussie')
    router.push('/login')
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value =
      error.response?.data?.message || "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
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
        <RegisterIcon :width="250" :height="250" :fillColor="'none'" />
      </div>
      <div
        class="flex-1 flex flex-col justify-center items-center bg-white relative overflow-y-auto w-full md:w-1/2"
      >
        <div class="flex flex-col items-center justify-center">
          <h1
            class="text-lg md:text-2xl font-semibold text-center text-gray-800 mb-2"
          >
            Inscrivez-vous et donnez du style à vos messages.
          </h1>
          <p class="text-sm text-center text-gray-700 mb-4">
            Avec <span class="font-semibold">Google</span> ou par
            <span class="font-semibold">Email</span>, c'est rapide et simple.
          </p>

          <div class="flex justify-center mb-4">
            <GoogleIcon
              :width="60"
              :height="60"
              fillColor="none"
              :className="'transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer'"
            />
          </div>

          <div class="text-center font-medium text-gray-900 my-3.5 relative">
            Ou
          </div>

          <form class="w-80" @submit.prevent="register">
            <div
              v-if="errorMessage"
              class="bg-errror-message-light text-error-message p-2.5 rounded mb-3 text-center text-sm"
            >
              {{ errorMessage }}
            </div>

            <div class="mb-3">
              <label
                for="name"
                class="block mb-1 text-gray-800 text-xs font-medium"
                >Nom complet</label
              >
              <input
                type="text"
                id="name"
                v-model="name"
                placeholder="Prénom Nom"
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <div class="mb-3">
              <label
                for="username"
                class="block mb-1 text-gray-800 text-xs font-medium"
                >Nom d'utilisateur</label
              >
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Pseudo"
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <div class="mb-3">
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
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <div class="mb-3">
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
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <div class="mb-3">
              <label
                for="confirmPassword"
                class="block mb-1 text-gray-800 text-xs font-medium"
                >Confirmation mot de passe</label
              >
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="******"
                class="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm"
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full p-2.5 bg-validate-button hover:bg-validate-button-hover text-white rounded-lg font-semibold text-sm mt-2.5 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
              <span v-if="loading" class="inline-block mr-2 align-middle">
                <LoadingSpinnerIcon
                  :className="'animate-spin h-5 w-5 text-white'"
                />
              </span>
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>