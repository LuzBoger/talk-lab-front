import { createRouter, createWebHistory } from 'vue-router'
import authService from '../api/authService'
import ConversationSimulator  from '../components/ConversationSimulator.vue'
import ConversationPublic from '../components/ConversationPublic.vue'
import ConversationList from '../components/ConversationList.vue'
import DefaultLayout from '../layout/DefaultLayout.vue'
import FavoriteConversation from '../components/FavoriteConversation.vue'
import NotificationsList from '../components/NotificationsList.vue'

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
        path: '/decouverte',
        name: 'Découverte de conversation',
        component: ConversationPublic,
      },
      {
        path: '/conversation/nouvelle',
        name: 'Conversation',
        component: ConversationSimulator ,
        meta: {
          requiresAuth: true,
        },
      },

      {
        path: '/conversation/:id',
        name: 'Conversation',
        component: ConversationSimulator ,
      },
      {
        path: '/profil',
        redirect: '/profil/mes-favoris',
        children: [
          {
            path: 'mes-favoris',
            name: 'Mes Favoris',
            component: FavoriteConversation,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'mes-conversations',
            name: 'Mes conversations',
            component: ConversationList,
            meta: {
              requiresAuth: true,
            },
          },

        ],
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
