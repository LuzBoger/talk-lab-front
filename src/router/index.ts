import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layout/DefaultLayout.vue'

import { useAuthStore } from '../stores/useAuthStore'

const HomePage = () => import('../pages/index.vue')
const DiscoverPublicConversation = () => import('../pages/decouverte/index.vue')
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
const SubscriptionPlansView = () => import('../pages/SubscriptionPlansView.vue')
const MySubscriptionPage = () => import('../pages/MySubscriptionPage.vue')

const AdminDashboardPage = () => import('../pages/admin/AdminDashboardPage.vue')
const PlanListPage = () => import('../pages/admin/PlanListPage.vue')
const PlanFormPage = () => import('../pages/admin/PlanFormPage.vue')
const SubscriptionListPage = () =>
  import('../pages/admin/SubscriptionListPage.vue')
const SubscriptionManagementPage = () =>
  import('../pages/admin/SubscriptionManagementPage.vue')
const ReportsPage = () => import('../pages/admin/ReportsPage.vue')

const HomePagePublic = () => import('../pages/indexPublic.vue')
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
      path: '/accueil',
      name: "Page Accueil publique",
      component: HomePagePublic,
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
      {
        path: '/subscription/plans',
        name: 'SubscriptionPlans',
        component: SubscriptionPlansView,
        // Page publique - accessible sans connexion
      },
      {
        path: '/subscription/my-subscription',
        name: 'MySubscription',
        component: MySubscriptionPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/my-subscription',
        name: 'MySubscriptionShort',
        component: MySubscriptionPage,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboardPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/plans',
        name: 'AdminPlans',
        component: PlanListPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/plans/new',
        name: 'AdminPlanNew',
        component: PlanFormPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/plans/:id/edit',
        name: 'AdminPlanEdit',
        component: PlanFormPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/subscriptions',
        name: 'AdminSubscriptions',
        component: SubscriptionListPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/subscription-management',
        name: 'AdminSubscriptionManagement',
        component: SubscriptionManagementPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/reports',
        name: 'AdminReports',
        component: ReportsPage,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Si le store n'a pas encore chargé l'utilisateur, on attend
  if (authStore.isAuthLoading) {
    await authStore.loadUser()
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role?.includes('ROLE_ADMIN')

  if (!to.meta || to.meta.requiresAuth === false) {
    next()
    return
  }

  if(to.path === '/') {
    if(!isAuthenticated) {
      next("/accueil")
      return
    }
  } else if(to.path === "/accueil" && isAuthenticated) {
    next('/')
    return
  }



  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
