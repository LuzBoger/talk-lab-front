import { createRouter, createWebHistory } from 'vue-router'
import authService from '../api/authService'

const HomePage = () => import('../pages/index.vue')
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
    path: '/subscription/plans',
    name: 'SubscriptionPlans',
    component: SubscriptionPlansView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/my-subscription',
    name: 'MySubscription',
    component: MySubscriptionView,
    meta: {
      requiresAuth: true
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

  {
    path: '/admin',
    name: 'Admin',
    component: AdminDashboardView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/plans',
    name: 'AdminPlans',
    component: PlanListView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/plans/new',
    name: 'AdminPlanNew',
    component: PlanFormView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/plans/:id/edit',
    name: 'AdminPlanEdit',
    component: PlanFormView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/subscriptions',
    name: 'AdminSubscriptions',
    component: SubscriptionListView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/subscription-management',
    name: 'AdminSubscriptionManagement',
    component: SubscriptionManagementView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: ReportsView,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const isAdmin = authService.isAdmin()
  
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