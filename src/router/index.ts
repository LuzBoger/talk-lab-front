import { createRouter, createWebHistory } from 'vue-router'
import ConversationSimulator  from '../components/ConversationSimulator.vue'
import DefaultLayout from '../layout/DefaultLayout.vue'
import { useAuthStore } from '../stores/useAuthStore'

const HomePage = () => import('../pages/index.vue')
const DiscoverPublicConversation = () => import('../pages/decouverte/index.vue')
const Categories = () => import('../pages/categories/index.vue')
const ConversationByCategories = () => import('../pages/categorie/[categoryName].vue')
const UserProfile = () => import('../pages/profil/mes-information.vue')
const UserConversation = () => import('../pages/profil/mes-conversations.vue')
const UserFavorites = () => import('../pages/profil/mes-favoris.vue')
const UserNotifications = () => import('../pages/profil/mes-notifications.vue')
const Parameter = () => import('../pages/parametre.vue')
const LoginPage = () => import('../pages/LoginPage.vue')
const RegisterPage = () => import('../pages/RegisterPage.vue')
const SubscriptionPlansView = () => import('../views/SubscriptionPlansView.vue')
const MySubscriptionView = () => import('../views/MySubscriptionView.vue')

const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue')
const PlanListView = () => import('../views/admin/PlanListView.vue')
const PlanFormView = () => import('../views/admin/PlanFormView.vue')
const SubscriptionListView = () => import('../views/admin/SubscriptionListView.vue')
const SubscriptionManagementView = () => import('../views/admin/SubscriptionManagementView.vue')
const ReportsView = () => import('../views/admin/ReportsView.vue')

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
        component: Categories
      },
      {
        path: '/decouverte',
        name: 'Découverte des conversations publiques',
        component: DiscoverPublicConversation,
      },
      {
        path: '/categorie/:categoryName',
        name: 'Conversation pour la category',
        component: ConversationByCategories
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
        component: MySubscriptionView,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboardView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/plans',
        name: 'AdminPlans',
        component: PlanListView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/plans/new',
        name: 'AdminPlanNew',
        component: PlanFormView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/plans/:id/edit',
        name: 'AdminPlanEdit',
        component: PlanFormView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/subscriptions',
        name: 'AdminSubscriptions',
        component: SubscriptionListView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/subscription-management',
        name: 'AdminSubscriptionManagement',
        component: SubscriptionManagementView,
        meta: {
          requiresAuth: true,
          requiresAdmin: true,
        },
      },
      {
        path: '/admin/reports',
        name: 'AdminReports',
        component: ReportsView,
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.user?.role?.includes('ROLE_ADMIN')

  if (!to.meta || to.meta.requiresAuth === false) {
    next()
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