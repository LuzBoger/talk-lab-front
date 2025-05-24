import { createRouter, createWebHistory } from 'vue-router'
import authService from '../api/authService'
import ConversationForm from '../components/ConversationForm.vue'
import ConversationList from '../components/ConversationList.vue'
import DefaultLayout from '../layout/DefaultLayout.vue'

const HomePage = () => import('../pages/index.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage,
      },
      {
        path: '/mes-conversations',
        name: 'Mes conversations',
        component: ConversationList,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/conversation/nouvelle',
        name: 'Conversation',
        component: ConversationForm,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: '/conversation/:id',
        name: 'Conversation',
        component: ConversationForm,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: {
      requiresGuest: true,
    },
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
