<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../api/authService'
import LoginIcon from '../components/icon/LoginIcon.vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    console.log('Tentative de connexion avec:', {
      email: email.value,
      password: '******',
    })

    await authService.login({
      email: email.value,
      password: password.value,
    })

    router.push('/')
  } catch (error: any) {
    console.error("Détails de l'erreur:", error)
    errorMessage.value = error.response?.data?.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="register-page">
    <router-link to="/" class="back-button">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
          fill="black"
        />
      </svg>
    </router-link>
    <div class="register-container">
      <div class="logo-section"><LoginIcon /></div>
      <div class="separator"></div>

      <div class="form-section">
        <div class="form-content">
          <h1 class="title">Connectez-vous à votre compte</h1>

          <p class="subtitle">
            Avec Google ou par email, c'est rapide et simple.
          </p>

          <form class="register-form" @submit.prevent="login">
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="form-group">
              <label for="email">E-mail</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="exemple@mail.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="******"
                required
              />
            </div>

            <button type="submit" class="register-button" :disabled="loading">
              <span v-if="loading" class="loading-spinner">
                <svg
                  class="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              Se connecter
            </button>
          </form>
          <div class="divider">ou</div>

          <div class="google-section">
            <svg
              width="76"
              height="76"
              viewBox="0 0 76 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <rect width="76" height="76" fill="url(#pattern0_36_1224)" />
              <defs>
                <pattern
                  id="pattern0_36_1224"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_36_1224"
                    transform="scale(0.00444444)"
                  />
                </pattern>
                <image
                  id="image0_36_1224"
                  width="225"
                  height="225"
                  preserveAspectRatio="none"
                  xlink:href="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>

          <p class="register-link text-center mt-4">
            Pas encore de compte ?
            <router-link to="/register" class="text-green-600"
              >S'inscrire</router-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
}

.separator {
  width: 1px !important;
  height: 100% !important;
  background-color: #b3b3b3 !important;
  margin: 0 !important;
  padding: 0 !important;
}

.logo-section {
  flex: 1 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background-color: white !important;
  margin: 0 !important;
  padding: 0 !important;
  border-right: 1px solid #b3b3b3 !important;
}

#app {
  height: 100% !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  background-color: transparent !important;
  display: block !important;
}

.app-container,
.main-content,
.sidebar {
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<style scoped>
.register-page {
  display: flex !important;
  width: 100vw !important;
  height: 100vh !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 9999 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.register-container {
  display: flex !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.logo-section {
  flex: 1 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  background-color: white !important;
  margin: 0 !important;
  padding: 0 !important;
}

.logo {
  width: 300px !important;
  height: 226.38px !important;
  object-fit: contain !important;
}

.form-section {
  flex: 1 !important;
  background-color: white !important;
  position: relative !important;
  overflow-y: auto !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  padding: 0 !important;
}

.back-button {
  position: absolute !important;
  top: 20px !important;
  left: 20px !important;
  cursor: pointer !important;
  z-index: 10 !important;
}

.form-content {
  max-width: 400px !important;
  width: 90% !important;
  margin: 0 auto !important;
  padding: 60px 0 30px 0 !important;
  position: relative !important;
}

.title {
  font-size: 22px !important;
  font-weight: 600 !important;
  text-align: center !important;
  margin-bottom: 8px !important;
  color: #333 !important;
}

.subtitle {
  font-size: 14px !important;
  text-align: center !important;
  margin-bottom: 15px !important;
  color: #666 !important;
}

.google-section {
  display: flex !important;
  justify-content: center !important;
  margin-bottom: 15px !important;
}

.divider {
  width: 100% !important;
  text-align: center !important;
  margin: 15px 0 !important;
  position: relative !important;
  color: #666 !important;
}

.form-group {
  margin-bottom: 12px !important;
}

.form-group label {
  display: block !important;
  margin-bottom: 4px !important;
  font-size: 13px !important;
  color: #333 !important;
}

.form-group input {
  width: 100% !important;
  padding: 10px !important;
  border: 1px solid #ddd !important;
  border-radius: 5px !important;
  font-size: 14px !important;
  background-color: #f8f9fa !important;
}

.error-message {
  background-color: #fde8e8;
  color: #c53030;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 12px;
  font-size: 14px;
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

.register-button {
  width: 100% !important;
  padding: 10px !important;
  background-color: #007f56 !important;
  color: white !important;
  border: none !important;
  border-radius: 5px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  margin-top: 10px !important;
  margin-bottom: 20px !important;
}

.register-button:disabled {
  background-color: #6b7280 !important;
  cursor: not-allowed !important;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #007f56;
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 992px) {
  .register-container {
    flex-direction: column !important;
  }

  .logo-section {
    flex: none !important;
    height: 20vh !important;
  }

  .form-section {
    flex: none !important;
    height: 80vh !important;
    justify-content: center !important;
    padding: 0 !important;
  }

  .form-content {
    padding: 50px 0 20px 0 !important;
  }
  .logo {
    width: 300px !important;
    height: auto !important;
    max-width: 90% !important;
  }

  .title {
    font-size: 20px !important;
    margin-bottom: 5px !important;
  }

  .subtitle {
    font-size: 13px !important;
    margin-bottom: 10px !important;
  }

  .google-section {
    margin-bottom: 10px !important;
  }

  .divider {
    margin: 10px 0 !important;
  }

  .form-group {
    margin-bottom: 8px !important;
  }

  .form-group label {
    margin-bottom: 2px !important;
    font-size: 12px !important;
  }

  .form-group input {
    padding: 8px !important;
    font-size: 13px !important;
  }

  .register-button {
    padding: 8px !important;
    font-size: 14px !important;
    margin-top: 8px !important;
    margin-bottom: 15px !important;
  }
}

@media (max-height: 600px) {
  .logo-section {
    height: 15vh !important;
  }

  .form-section {
    height: 85vh !important;
    justify-content: center !important;
    padding: 0 !important;
  }
  .logo {
    width: 200px !important;
  }
  .form-content {
    padding: 40px 0 10px 0 !important;
  }

  .title {
    font-size: 18px !important;
    margin-bottom: 3px !important;
  }

  .subtitle {
    font-size: 12px !important;
    margin-bottom: 8px !important;
  }

  .google-section svg {
    width: 70px !important;
    height: 70px !important;
  }

  .form-group {
    margin-bottom: 6px !important;
  }

  .form-group input {
    padding: 6px !important;
  }
}
</style>
