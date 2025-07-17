import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Vue3Toastify from 'vue3-toastify'
import 'bootstrap/dist/css/bootstrap.min.css' // Add this line

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(Vue3Toastify, {
  autoClose: 5000,
  position: 'top-right',
  transition: 'slice',
})
app.mount('#app')
