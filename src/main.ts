import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Vue3Toastify from 'vue3-toastify'
import GoogleLoginPlugin from 'vue3-google-login'
import {createHead} from '@vueuse/head'
const app = createApp(App)
const head = createHead()
app.use(router)
app.use(createPinia())
app.use(head)
app.use(Vue3Toastify, {
    autoClose: 5000,
    position: 'top-right',
    transition: 'slice'
})
app.use(GoogleLoginPlugin, {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ,
})
app.mount('#app')
