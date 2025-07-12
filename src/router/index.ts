import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/DefaultLayout.vue'

import { useAuthStore } from '../stores/useAuthStore'

const HomePage = () => import('../pages/index.vue')
const DiscoverPublicConversation = () => import('../pages/decouverte/index.vue')
const Categories = () => import('../pages/categories/index.vue')
const ConversationByCategories = () =>
  import('../pages/categorie/[categoryName].vue')
const UserProfile = () => import('../pages/profil/mes-information.vue')
const UserConversation = () => import('../pages/profil/mes-conversations.vue')
const UserFavorites = () => import('../pages/profil/mes-favoris.vue')
const UserNotifications = () => import('../pages/profil/mes-notifications.vue')
const Parameter = () => import('../pages/parametre.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')
const ConversationSimulatorCreationPage = () =>
  import('../pages/conversation/ConversationCreationPage.vue')
const ConversationSimulatorEditPage = () =>
  import('../pages/conversation/ConversationEditPage.vue')
const ConversationSimulatorViewPage = () =>
  import('../pages/conversation/ConversationViewPage.vue')
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
        path: '/categories',
        name: 'Catégories',
        component: Categories,
      },
      {
        path: '/decouverte',
        name: 'Découverte des conversations publiques',
        component: DiscoverPublicConversation,
      },
      {
        path: '/categorie/:categoryName',
        name: 'Conversation pour la category',
        component: ConversationByCategories,
      },
      {
        path: '/view-conversation/:id',
        name: 'ViewConversation',
        component: ConversationSimulatorViewPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/edit-conversation/:id',
        name: 'EditConversation',
        component: ConversationSimulatorEditPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/create-conversation',
        name: 'CreateConversation',
        component: ConversationSimulatorCreationPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/profil',
        redirect: '/profil/mes-informations',
        children: [
          {
            path: 'mes-informations',
            name: 'Mes Informations',
            component: UserProfile,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'mes-favoris',
            name: 'Mes Favoris',
            component: UserFavorites,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'mes-conversations',
            name: 'Mes conversations',
            component: UserConversation,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'mes-notifications',
            name: 'Mes Notitifications',
            component: UserNotifications,
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'securite',
            name: 'Mes Parametres',
            component: Parameter,
            meta: {
              requiresAuth: true,
            },
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAuthenticated = authStore.isAuthenticated

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
