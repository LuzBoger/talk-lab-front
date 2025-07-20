<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import LoginIcon from '../components/icon/LoginIcon.vue'
import ArrowIcon from '../components/icon/ArrowIcon.vue'
import TwoFactorModal from '../components/2FA/TwoFactorModal.vue'
import {useHead} from '@vueuse/head';
import type { LoginCredentials } from '../types/login/LoginCredentials'
import type { LoginCredentialsError } from '../types/login/LoginCredentialsError'
import * as yup from 'yup'
import { loginSchema } from '../validation/loginSchema'
import LoginForm from '../components/LoginForm.vue'

useHead({
  title: 'Connexion',
  meta:[
    {name: 'description', content: 'Connectez-vous à TalkLabs pour accéder au simulateur en ligne et créer votre propre fake conversations ou en découvrait divers conversations.'},
    {name: 'robots', content: 'noindex, nofollow' },
    {property: 'og:description', content: 'Connectez-vous à TalkLabs pour accéder au simulateur en ligne et créer votre propre fake conversations ou en découvrait divers conversations.'},
    { name: 'twitter:description', content:'Connectez-vous à TalkLabs pour accéder au simulateur en ligne et créer votre propre fake conversations ou en découvrait divers conversations.' },
  ]
})
const router = useRouter()
const authStore = useAuthStore()

const form = ref<LoginCredentials>({
  email: '',
  password: ''
})

const errors = ref<LoginCredentialsError>({
  emailError: '',
  passwordError: ''
})
const resetErrors = () => {
  errors.value = {
    emailError: '',
    passwordError: '',

  }
}

const errorMessage = ref('')
const loading = ref(false)
const showModalTwoFactor = ref(false)
const errorMessageModal = ref('')

const validateForm = async () => {
  resetErrors()
  try {
    await loginSchema.validate(form.value, { abortEarly: false });
    return true;
  } catch (err: any) {
    err.inner.forEach((error: yup.ValidationError) => {
      const errorField = `${error.path}Error` as keyof LoginCredentialsError;
      errors.value[errorField] = error.message;
    });
    return false;
  }
};

const login = async () => {
  loading.value = true
  errorMessage.value = ''
  const isValid = await validateForm()
  if (!isValid) {
    loading.value = false
    return
  }


  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })

    if (authStore.isTwoFactorEnable) {
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

const handleCredentialResponse = async (response: any) => {
  const googleToken = response.credential
  try {
    loading.value = true
    errorMessage.value = ''
    await authStore.loginGoogle(googleToken)
    if (authStore.isTwoFactorEnable) {
      showModalTwoFactor.value = true
      return
    }
    router.push('/')
  } catch (error: any) {
    console.error("Détails de l'erreur:", error)
    errorMessage.value =
      error.response?.data?.message || 'Erreur de connexion avec Google'
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
  } catch (error: any) {
    errorMessageModal.value =
      error.response?.data?.message || 'Code 2FA invalide'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModalTwoFactor.value = false
  errorMessageModal.value = ''
}

onMounted(() => {
  window.google?.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  })

  window.google?.accounts.id.renderButton(
    document.getElementById('google-button') as HTMLElement,
    { theme: 'outline', size: 'large', type: 'standard', shape: 'pill' },
  )
})
</script>

<template>
  <div class="flex w-screen h-screen relative">
    <router-link
      to="/"
      class="absolute top-5 left-5 z-10 cursor-pointer transition duration-300 ease-in-out hover:scale-110"
    >
      <ArrowIcon :width="25" :height="25" fillColor="white" />
    </router-link>
    <div class="flex w-full h-full overflow-hidden">
      <!-- Cette section sera masquée sur les petits écrans -->
      <div
        class="flex-1 justify-center items-center border-r border-gray-800 hidden md:flex"
      >
        <LoginIcon />
      </div>
      <div
        class="flex-1 flex flex-col justify-center items-center relative overflow-y-auto w-full"
      >
        <div class="relative flex flex-col gap-4">
          <h1
            class="text-lg md:text-2xl font-semibold text-center text-white mb-2"
          >
            Connectez-vous à votre compte
          </h1>
          <p class="text-sm text-center text-gray-100 mb-4">
            Avec <span class="font-semibold">Google</span> ou par
            <span class="font-semibold">Email</span>, c'est rapide et simple.
          </p>

          <LoginForm
          :form="form"
          :error-message="errorMessage"
          :errors="errors"
          :loading="loading"
          @submit="login"
          />

          <div class="text-center text-white relative font-semibold">Ou</div>

          <div class="flex justify-center">
            <div id="google-button"></div>
          </div>

          <p class="text-center text-white mt-4 text-sm">
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
