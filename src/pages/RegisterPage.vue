<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RegisterIcon from '../components/icon/RegisterIcon.vue'
import LoadingSpinnerIcon from '../components/icon/LoadingSpinnerIcon.vue'
import ArrowIcon from '../components/icon/ArrowIcon.vue'
import authService from '../api/authService'
import { useAuthStore } from '../stores/useAuthStore'
import { useHead } from '@vueuse/head';
import type { RegisterData } from '../types/register/RegisterData'
import type { RegisterDataError } from '../types/register/RegisterDataError'
import * as yup from 'yup'
import { registerSchema } from '../validation/registerSchema'
import RegisterForm from '../components/RegisterForm.vue'

useHead({
  title: 'Inscription',
  meta: [
    { name: 'description', content: 'Inscrivez-vous à TalkLabs pour accéder au simulateur en ligne et créer votre propre fake conversations ou en découvrait divers conversations.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:description', content: 'Inscrivez-vous à TalkLabs pour accéder au simulateur en ligne et créer votre propre fake conversations ou en découvrait divers conversations.' },
    { name: 'twitter:description', content: 'Inscrivez-vous à TalkLabs pour accéder au simulateur en ligne et créer votre propre fake conversations ou en découvrait divers conversations.' },
  ]
})

const authStore = useAuthStore()
const router = useRouter()

const form = ref<RegisterData>({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const errors = ref<RegisterDataError>({
  nameError: '',
  usernameError: '',
  emailError: '',
  passwordError: '',
  confirmPasswordError: ''
})
const resetErrors = () => {
  errors.value = {
    nameError: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: ''
  }
}
const errorMessage = ref('')
const loading = ref(false)

const validateForm = async () => {
  resetErrors()
  try {
    await registerSchema.validate(form.value, { abortEarly: false });
    return true;
  } catch (err: any) {
    err.inner.forEach((error: yup.ValidationError) => {
      const errorField = `${error.path}Error` as keyof RegisterDataError;
      errors.value[errorField] = error.message;
    });
    return false;
  }
};

const register = async () => {

  errorMessage.value = ''
  loading.value = true

  const isValid = await validateForm()
  if (!isValid) {
    loading.value = false
    return
  }

  try {
    await authService.register({
      name: form.value.name,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    })
    router.push('/login')
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async (response: any) => {
  const googleToken = response.credential

  try {
    loading.value = true
    errorMessage.value = ''

    await authStore.loginGoogle(googleToken)
    router.push('/')
  } catch (error: any) {
    console.error("Détails de l'erreur:", error)
    errorMessage.value =
      error.response?.data?.message || 'Erreur lors de la connexion avec Google'
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  window.google?.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleRegister,
  })

  window.google?.accounts.id.renderButton(
    document.getElementById('google-button') as HTMLElement,
    {
      theme: 'outline',
      size: 'large',
      type: 'icon',
      shape: 'circle',
      locale: 'fr',
    },
  )
})
</script>

<template>
  <div class="flex w-screen h-screen">
    <router-link to="/"
      class="absolute top-5 left-5 z-10 cursor-pointer transition duration-300 ease-in-out hover:scale-110">
      <ArrowIcon :width="25" :height="25" fillColor="white" />
    </router-link>
    <div class="flex w-full h-full overflow-hidden">
      <div class="flex-1 justify-center items-center border-r border-gray-800 hidden md:flex">
        <RegisterIcon :width="250" :height="250" :fillColor="'none'" />
      </div>
      <div class="flex-1 flex flex-col justify-center items-center relative overflow-y-auto w-full md:w-1/2">
        <div class="flex flex-col items-center justify-center">
          <h1 class="text-lg md:text-2xl font-semibold text-center text-white mb-2">
            Inscrivez-vous et donnez du style à vos messages.
          </h1>
          <p class="text-sm text-center text-white mb-4">
            Avec <span class="font-semibold">Google</span> ou par
            <span class="font-semibold">Email</span>, c'est rapide et simple.
          </p>

          <div class="flex justify-center mb-4">
            <div id="google-button"></div>
          </div>

          <div class="text-center font-medium text-white my-3.5 relative">
            Ou
          </div>

          <RegisterForm
          :form="form"
          :errors="errors"
          :loading="loading"
          :errorMessage="errorMessage"
          @submit="register"
          />
        </div>
      </div>
    </div>
  </div>
</template>
