import { createRouter, createWebHistory } from 'vue-router'
import authService from '../api/authService'

const HomePage = () => import('../pages/index.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { 
      requiresGuest: true 
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { 
      requiresGuest: true 
    }
  },
    {
    path: '/conversation/create',
    name: 'Conversation',
    component: () => import('../conversation/index.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/conversation/:id',
    name: 'Conversation',
    component: () => import('../conversation/[id].vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (!to.meta || to.meta.requiresAuth === false) {
    next()
    return
  }
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
