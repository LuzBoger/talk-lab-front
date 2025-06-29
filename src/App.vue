<template>
  <div id="app">
    <Sidebar 
      :is-logged-in="isLoggedIn" 
      :is-admin="isAdmin"
      :has-active-subscription="hasActiveSubscription"
      @logout="handleLogout"
    />
    <div class="main-content" :class="{ 'with-sidebar': isLoggedIn }">
      <router-view @auth-changed="checkAuth"></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import authService from './api/authService'
import subscriptionService from './api/subscriptionService'

export default defineComponent({
  name: 'App',
  components: {
    Sidebar
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isLoggedIn = ref(false)
    const isAdmin = ref(false)
    const hasActiveSubscription = ref(false)
    
    let lastSubscriptionCheck = 0
    let isCheckingSubscription = false
    const CACHE_DURATION = 10000 

    const checkSubscription = async (forceRefresh = false) => {
      if (!isLoggedIn.value) {
        hasActiveSubscription.value = false
        return
      }

      const now = Date.now()
      
      if (!forceRefresh && now - lastSubscriptionCheck < CACHE_DURATION) {
        return
      }

      if (isCheckingSubscription) {
        return
      }

      isCheckingSubscription = true
      
      try {
        const subscription = await subscriptionService.getCurrentSubscription()
        hasActiveSubscription.value = subscription?.status === 'active'
        lastSubscriptionCheck = now
      } catch (error: any) {
        if (error.response?.status === 404) {
          hasActiveSubscription.value = false
          lastSubscriptionCheck = now
        } else {
          console.error('Erreur lors de la vérification de l\'abonnement:', error)
          hasActiveSubscription.value = false
        }
      } finally {
        isCheckingSubscription = false
      }
    }

    const checkAuth = async (forceSubscriptionRefresh = false) => {
      const wasLoggedIn = isLoggedIn.value
      isLoggedIn.value = authService.isAuthenticated()
      isAdmin.value = authService.isAdmin()
      
      if (wasLoggedIn !== isLoggedIn.value) {
        await checkSubscription(true)
      } else {
        await checkSubscription(forceSubscriptionRefresh)
      }

      if (!isLoggedIn.value && route.meta.requiresAuth) {
        router.push('/login')
      }

      if (route.meta.requiresSubscription && !hasActiveSubscription.value && !isAdmin.value && route.path !== '/subscription/plans') {
        router.push('/subscription/plans')
      }
    }

    const handleLogout = () => {
      authService.logout()
      lastSubscriptionCheck = 0
      checkAuth()
      router.push('/login')
    }

    onMounted(() => {
      checkAuth(true) 
    })

    watch(() => route.path, () => {
      checkAuth(false) 
    })

    const authCheckInterval = setInterval(() => checkAuth(true), 60000) 

    onUnmounted(() => {
      clearInterval(authCheckInterval)
    })

    return {
      isLoggedIn,
      isAdmin,
      hasActiveSubscription,
      handleLogout,
      checkAuth
    }
  }
})
</script>

<style>
#app {
  display: flex;
  background-color: #11101A;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.main-content.with-sidebar {
  margin-left: 305px;
}

@media (max-width: 768px) {
  .main-content.with-sidebar {
    margin-left: 80px;
  }
}
</style>
