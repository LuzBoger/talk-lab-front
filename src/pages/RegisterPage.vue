<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../api/authService';

const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const loading = ref(false);
const router = useRouter();

const register = async () => {
  if (!name.value || !username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Veuillez remplir tous les champs';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await authService.register({
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value
    });
    
    router.push('/login');
  } catch (error: any) {
    console.error('Registration error:', error);
    errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'inscription';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="register-page">
    <router-link to="/" class="back-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="black"/>
      </svg>
    </router-link>
    <div class="register-container">
      <div class="logo-section">
        <svg width="250" height="250" viewBox="0 0 100 84" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M83.534 6.65088L45.9681 42.0083H69.3043L93.2213 16.5976L83.534 6.65088Z" fill="#236D3C"/>
<path d="M92.0213 39.4917L55.851 82.0448C79.3525 82.0448 98.4041 62.9931 98.4041 39.4917H92.0213Z" fill="#236D3C"/>
<path d="M1.5957 39.4917C1.5957 48.5554 8.34258 56.0433 17.0879 57.2069V57.0706C23.7787 71.8011 38.6182 82.045 55.8512 82.045C75.8273 82.045 92.0213 62.9933 92.0213 39.4919L1.5957 39.4917Z" fill="#269C52"/>
<path d="M97.2699 13.8246L86.1729 2.72749C84.6608 1.21519 82.2088 1.21519 80.6967 2.72749C79.1846 4.2396 79.1846 6.69155 80.6967 8.20386L91.7938 19.3009C93.3059 20.8132 95.7578 20.8132 97.2699 19.3009C98.7824 17.7884 98.7824 15.3369 97.2699 13.8246Z" fill="#269C52"/>
<path d="M98.4066 37.8961L75.3967 37.8633L91.2953 20.9705C93.4334 22.5424 96.4658 22.3619 98.3982 20.4293C99.4311 19.3965 100 18.0234 100 16.5627C100 15.1021 99.4312 13.7289 98.3984 12.6961L87.3014 1.59902C85.1689 -0.533008 81.7006 -0.533008 79.5682 1.59902C77.6354 3.53184 77.4547 6.56367 79.027 8.70195L48.2648 37.6539C48.208 37.7072 48.1578 37.7648 48.1107 37.824L1.59805 37.7576C1.59727 37.7576 1.59648 37.7576 1.5957 37.7576C1.17285 37.7576 0.767187 37.9254 0.467969 38.2242C0.168555 38.5234 0 38.9297 0 39.3533C0 48.7773 6.82051 56.8625 16.0041 58.5139C18.5992 63.9404 22.3018 68.8315 26.9217 72.8424C30.6477 76.0772 34.8602 78.6356 39.3687 80.4492H36.7021C35.8207 80.4492 35.1064 81.1637 35.1064 82.0449C35.1064 82.9262 35.8207 83.6406 36.7021 83.6406H75C75.8814 83.6406 76.5957 82.9262 76.5957 82.0449C76.5957 81.1637 75.8814 80.4492 75 80.4492H72.3268C88.5332 73.9064 100 58.0141 100 39.4918C100 38.6113 99.2867 37.8973 98.4066 37.8961ZM81.2389 11.0029L85.5756 15.3395C85.8873 15.651 86.2959 15.8068 86.7041 15.8068C87.1123 15.8068 87.5209 15.6512 87.8326 15.3395C88.4559 14.7162 88.4559 13.7059 87.8326 13.0828L82.4041 7.6543C82.4031 7.65332 82.4022 7.65215 82.4012 7.65117L81.8252 7.07539C80.9375 6.1877 80.9375 4.74356 81.8252 3.85586C82.7129 2.96816 84.1568 2.96816 85.0445 3.85586L96.1418 14.9531C96.5717 15.3832 96.8086 15.9549 96.8086 16.5629C96.8086 17.1709 96.5719 17.7428 96.1416 18.1727C95.2541 19.0602 93.8102 19.0604 92.9223 18.1727L92.3463 17.5967C92.041 17.2914 91.6311 17.1271 91.1937 17.1295C90.7623 17.1359 90.3516 17.317 90.0557 17.6314L71.1463 37.7229C71.1057 37.766 71.0684 37.8111 71.0336 37.8576L52.734 37.8314L81.2389 11.0029ZM55.851 80.4492C35.7479 80.4492 18.3367 65.4834 15.3514 45.6375C15.2322 44.8465 14.5516 44.2789 13.7754 44.2789C13.6965 44.2789 13.6164 44.2846 13.5359 44.2971C12.6643 44.4281 12.0641 45.2408 12.1951 46.1123C12.6457 49.1074 13.4043 52.0309 14.4475 54.8406C8.36152 52.8658 3.90723 47.4031 3.26992 40.9516L96.7775 41.0852C95.9381 62.934 77.9018 80.4492 55.851 80.4492Z" fill="#1D1C31"/>
</svg>
      </div>
      <div class="separator"></div>

      <div class="form-section">
        <div class="form-content">
          <h1 class="title">Inscrivez-vous et donnez du style à vos messages.</h1>
          
          <p class="subtitle">Avec Google ou par email, c'est rapide et simple.</p>
          
          <div class="google-section">
            <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="76" height="76" fill="url(#pattern0_36_1224)"/>
<defs>
<pattern id="pattern0_36_1224" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_36_1224" transform="scale(0.00444444)"/>
</pattern>
<image id="image0_36_1224" width="225" height="225" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
          </div>
          
          <div class="divider">ou</div>
          
          <form class="register-form" @submit.prevent="register">
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

            <div class="form-group">
              <label for="name">Nom complet</label>
              <input type="text" id="name" v-model="name" placeholder="Prénom Nom" />
            </div>
            
            <div class="form-group">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" v-model="username" placeholder="Pseudo" />
            </div>
            
            <div class="form-group">
              <label for="email">E-mail</label>
              <input type="email" id="email" v-model="email" placeholder="exemple@mail.com" />
            </div>
            
            
            
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input type="password" id="password" v-model="password" placeholder="******" />
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmation mot de passe</label>
              <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="******" />
            </div>
            
            <button type="submit" class="register-button" :disabled="loading">
              <span v-if="loading" class="loading-spinner">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template> 

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  margin: 0 !important;
  padding: 0 !important;
  height: 100% !important;
  width: 100% !important;
  overflow: hidden !important;
  background-color: transparent !important;
}

.separator {
  width: 1px !important;
  height: 100% !important;
  background-color: #B3B3B3 !important;
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
  border-right: 1px solid #B3B3B3 !important;
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

.app-container, .main-content, .sidebar {
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
  background-color: #007F56 !important;
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