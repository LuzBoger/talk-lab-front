<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../api/authService'

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
      <div class="logo-section">
        <svg
          width="250"
          height="250"
          viewBox="0 0 450 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M268.085 7.18066H225V171.316H268.085V7.18066Z"
            fill="#646282"
          />
          <path
            d="M87.0363 28.4346L29.54 52.2503L100.521 223.615L147.86 175.275L87.0363 28.4346Z"
            fill="#817F9A"
          />
          <path
            d="M362.964 28.4346L302.176 175.307L349.48 223.611L420.46 52.2503L362.964 28.4346Z"
            fill="#646282"
          />
          <path
            d="M225 136.437V442.82C309.604 442.82 378.192 374.234 378.192 289.628C378.192 205.022 309.606 136.437 225 136.437Z"
            fill="#646282"
          />
          <path
            d="M225 136.437C140.394 136.437 71.8085 205.023 71.8085 289.628C71.8085 374.233 140.395 442.82 225 442.82C293.742 442.82 349.468 374.234 349.468 289.628C349.468 205.022 293.742 136.437 225 136.437Z"
            fill="#817F9A"
          />
          <path
            d="M239.362 7.18066H181.915V171.316H239.362V7.18066Z"
            fill="#817F9A"
          />
          <path
            d="M333.325 251.329H306.243L225 404.521C288.352 404.521 339.893 352.981 339.893 289.627C339.893 276.204 337.576 263.314 333.325 251.329Z"
            fill="#272748"
          />
          <path
            d="M306.244 251.329H116.675C112.424 263.314 110.107 276.204 110.107 289.627C110.107 352.98 161.649 404.52 225 404.52C272.515 404.52 311.171 352.98 311.171 289.627C311.171 276.204 309.432 263.314 306.244 251.329Z"
            fill="#2C2C54"
          />
          <path
            d="M432.054 49.2794L356.865 18.1354C353.202 16.6184 349.001 18.3577 347.483 22.0219C345.965 25.686 347.705 29.8863 351.369 31.4042L353.583 32.3218L304.694 150.447C295.336 145.076 285.481 140.675 275.266 137.304V14.3613H277.66C281.625 14.3613 284.84 11.1463 284.84 7.18066C284.84 3.21504 281.626 0 277.661 0H172.34C168.375 0 165.16 3.21504 165.16 7.18066C165.16 11.1463 168.375 14.3613 172.34 14.3613H174.734V137.304C164.518 140.672 154.674 145.063 145.336 150.418L96.4196 32.3209L98.6309 31.4042C102.295 29.8863 104.034 25.6852 102.517 22.0219C101 18.3577 96.7993 16.6184 93.1351 18.1354L17.9464 49.2794C14.2823 50.7973 12.5429 54.9984 14.0599 58.6617C15.2051 61.4268 17.8788 63.0967 20.6965 63.0967C21.6132 63.0967 22.5431 62.9209 23.4413 62.5482L25.6518 61.6315L86.5521 208.655C72.1969 233.154 64.6269 261.069 64.6269 289.627C64.6278 378.057 136.571 450 225 450C313.429 450 385.372 378.057 385.372 289.628C385.372 261.061 377.803 233.144 363.449 208.651L424.346 61.6315L426.558 62.5482C427.457 62.9209 428.388 63.0967 429.303 63.0967C432.12 63.0967 434.795 61.4268 435.939 58.6617C437.457 54.9976 435.717 50.7973 432.054 49.2794ZM411.078 56.1357L348.795 206.5C347.912 208.632 348.108 211.058 349.32 213.021C363.509 235.995 371.01 262.485 371.01 289.627C371.01 370.137 305.51 435.638 224.999 435.638C144.488 435.638 78.9891 370.138 78.9891 289.628C78.9891 262.496 86.4906 236.007 100.683 213.027C101.895 211.064 102.09 208.637 101.208 206.505L38.9224 56.1357L83.1507 37.8158L135.277 163.659C136.093 165.629 137.74 167.133 139.776 167.766C140.475 167.984 141.195 168.091 141.911 168.091C143.28 168.091 144.636 167.699 145.811 166.939C157.627 159.296 170.452 153.421 183.931 149.477C186.993 148.582 189.096 145.775 189.096 142.586V14.3613H260.904V142.588C260.904 145.778 263.007 148.585 266.07 149.48C279.536 153.419 292.371 159.304 304.219 166.972C306.009 168.13 308.219 168.434 310.257 167.799C312.293 167.165 313.942 165.659 314.757 163.688L366.853 37.8149L378.425 42.6085L411.078 56.1357Z"
            fill="#1D1C31"
          />
          <path
            d="M333.325 244.148H116.675C113.635 244.148 110.923 246.064 109.907 248.929C105.275 261.988 102.925 275.682 102.925 289.627C102.925 356.939 157.687 411.701 225 411.701C280.675 411.701 329.285 374.053 343.211 320.147C344.203 316.307 341.895 312.389 338.055 311.397C334.215 310.405 330.297 312.713 329.305 316.554C317.018 364.118 274.127 397.339 225 397.339C165.607 397.339 117.288 349.02 117.288 289.627C117.288 279.013 118.828 268.569 121.873 258.51H328.129C331.173 268.569 332.714 279.014 332.714 289.627C332.714 293.592 335.93 296.807 339.895 296.807C343.861 296.807 347.076 293.592 347.076 289.627C347.076 275.681 344.727 261.988 340.094 248.929C339.076 246.064 336.365 244.148 333.325 244.148Z"
            fill="#1D1C31"
          />
        </svg>
      </div>
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
