<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import defaultProfileImg from '../assets/images/defaultAvatar.png'
import MenuItem from './sidebarComponents/MenuItem.vue'
import HomeIcon from './icon/HomeIcon.vue'
import CategoriesIcon from './icon/CategoriesIcon.vue'
import MyCreationIcon from './icon/MyCreationIcon.vue'
import CreateDiscussionIcon from './icon/CreateDiscussionIcon.vue'
import ForumIcon from './icon/ForumIcon.vue'
import TarificationIcon from './icon/TarificationIcon.vue'
import SubscriptionIcon from './icon/SubscriptionIcon.vue'
import LogoIcon from './icon/LogoIcon.vue'
import DropdownButton from './sidebarComponents/dropdownButton/DropdownButton.vue'
import ProfilIcon from './icon/ProfilIcon.vue'
import HelpIcon from './icon/HelpIcon.vue'
import LogoutIcon from './icon/LogoutIcon.vue'
import DropDownButtonLogout from './sidebarComponents/dropdownButton/DropDownButtonLogout.vue'
import { useAuthStore } from '../stores/useAuthStore'

const emit = defineEmits(['sidebar-toggle', 'logout'])
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const showProfileMenu = ref<boolean>(false)
const baseUrl = import.meta.env.VITE_BASE_URL

const isProfileRoute = computed(() => {
  return route.path.startsWith('/profil')
})
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}
const avatarUrl = computed(() => {
  if (authStore.user?.avatarUrl) {
    return `${baseUrl}${authStore.user.avatarUrl}`
  }
  return defaultProfileImg
})

const isAdmin = computed(() => {
  return authStore.user?.role?.includes('ROLE_ADMIN') || false
})

onMounted(() => {
  console.log('Sidebar component mounted')
  console.log('isAuthenticated:', authStore.isAuthenticated)
  console.log('User:', authStore.user)
  console.log('User role:', authStore.user?.role)
  console.log('Is admin?:', authStore.user?.role?.includes('ROLE_ADMIN'))
})
</script>

<template>
  <div
    class="h-screen bg-sidebar-bg flex flex-col justify-between text-text-primary w-16 md:w-72 p-2 md:p-5 transition-all duration-300"
  >
    <!-- Logo -->
    <div class="flex justify-center mb-6 md:mb-10">
      <router-link
        to="/"
        class="cursor-pointer flex items-center justify-center"
      >
        <LogoIcon class="max-md:w-12 max-md:h-12" />
      </router-link>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col flex-1 gap-1 md:gap-0">
      <template v-if="isProfileRoute">
        <MenuItem
          to="/profil/mes-informations"
          activePath="/profil/mes-informations"
        >
          <template #icon><ProfilIcon /></template>
          <span class="hidden md:inline">Mes informations</span>
        </MenuItem>
        <MenuItem
          to="/profil/mes-conversations"
          activePath="/profil/mes-conversations"
        >
          <template #icon><MyCreationIcon /></template>
          <span class="hidden md:inline">Mes Créations</span>
        </MenuItem>
        <MenuItem to="/profil/mes-favoris" activePath="/profil/mes-favoris">
          <template #icon><TarificationIcon /></template>
          <span class="hidden md:inline">Mes Favoris</span>
        </MenuItem>
        <MenuItem to="/profil/securite" activePath="/profil/securite">
          <template #icon><CategoriesIcon /></template>
          <span class="hidden md:inline">Mes Paramètres</span>
        </MenuItem>
      </template>
      <template v-else>
        <MenuItem to="/" activePath="/">
          <template #icon><HomeIcon /></template>
          <span class="hidden md:inline">Accueil</span>
        </MenuItem>
        <MenuItem
          to="/decouverte"
          activePath="/decouverte"
          v-if="authStore.isAuthenticated && !isAdmin"
        >
          <template #icon><MyCreationIcon /></template>
          <span class="hidden md:inline">Découverte</span>
        </MenuItem>
        <MenuItem
          to="/create-conversation"
          activePath="/create-conversation"
          v-if="!isAdmin"
        >
          <template #icon><CreateDiscussionIcon /></template>
          <span class="hidden md:inline">Créer</span>
        </MenuItem>
        <MenuItem to="/subscription/plans" activePath="/subscription/plans">
          <template #icon><TarificationIcon /></template>
          <span class="hidden md:inline">Tarification</span>
        </MenuItem>
        <MenuItem
          to="/my-subscription"
          activePath="/my-subscription"
          v-if="authStore.isAuthenticated"
        >
          <template #icon><SubscriptionIcon /></template>
          <span class="hidden md:inline">Mon abonnement</span>
        </MenuItem>
        <template v-if="isAdmin">
          <div
            class="border-t border-border-auth-button mt-4 pt-4 hidden md:block"
          >
            <div class="text-xs text-gray-400 mb-2 px-3">ADMINISTRATION</div>
            <MenuItem to="/admin" activePath="/admin">
              <template #icon><HomeIcon /></template>
              <span class="hidden md:inline">Dashboard Admin</span>
            </MenuItem>
            <MenuItem to="/admin/plans" activePath="/admin/plans">
              <template #icon><TarificationIcon /></template>
              <span class="hidden md:inline">Gestion des Plans</span>
            </MenuItem>
            <MenuItem
              to="/admin/subscriptions"
              activePath="/admin/subscriptions"
            >
              <template #icon><MyCreationIcon /></template>
              <span class="hidden md:inline">Abonnements</span>
            </MenuItem>
            <MenuItem
              to="/admin/subscription-management"
              activePath="/admin/subscription-management"
            >
              <template #icon><CategoriesIcon /></template>
              <span class="hidden md:inline">Gestion Abonnements</span>
            </MenuItem>
            <MenuItem to="/admin/reports" activePath="/admin/reports">
              <template #icon><ForumIcon /></template>
              <span class="hidden md:inline">Rapports</span>
            </MenuItem>
          </div>
          <!-- Admin accès rapide icône sur mobile -->
          <MenuItem to="/admin" activePath="/admin" class="md:hidden">
            <template #icon><CategoriesIcon /></template>
          </MenuItem>
        </template>
      </template>
    </nav>

    <!-- Profil / Auth -->
    <div
      class="pt-3 md:pt-5 border-t border-border-auth-button flex flex-col gap-2.5 items-center"
    >
      <template v-if="authStore.isAuthenticated">
        <div
          class="flex flex-col items-center cursor-pointer gap-1 md:flex-row md:gap-2.5 p-2.5 rounded-lg bg-dropdown-bg transition-colors duration-300 w-full"
          @click="toggleProfileMenu"
        >
          <img
            class="w-10 h-10 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0 border-2 border-avatar-border"
            :src="avatarUrl"
            alt="Avatar utilisateur"
          />
          <span
            class="font-semibold text-text-primary whitespace-nowrap hidden md:inline"
            >{{ authStore.user?.name }}</span
          >
        </div>
        <div
          v-if="showProfileMenu"
          class="mt-2 bg-dropdown-bg rounded-2xl shadow-lg flex flex-col p-2 absolute left-20 md:left-auto bottom-20 w-36 gap-1 z-80"
        >
          <DropdownButton label="Profil" to="/profil">
            <template #icon><ProfilIcon /></template>
          </DropdownButton>
          <DropdownButton v-if="isAdmin" label="Administration" to="/admin">
            <template #icon><CategoriesIcon /></template>
          </DropdownButton>
          <DropdownButton label="Aide" to="/aide">
            <template #icon><HelpIcon /></template>
          </DropdownButton>
          <DropDownButtonLogout label="Déconnexion" @action="logout">
            <template #icon><LogoutIcon /></template>
          </DropDownButtonLogout>
        </div>
      </template>
      <template v-else>
        <button
          @click="$router.push('/register')"
          class="border border-signup-button text-signup-button p-2.5 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-signup-button hover:text-white w-full hidden md:block"
        >
          S'inscrire
        </button>
        <button
          @click="$router.push('/login')"
          class="border border-text-primary text-text-primary p-2.5 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-auth-button-hover hover:text-white w-full hidden md:block"
        >
          Se connecter
        </button>
        <!-- Icône connexion mobile -->
        <button
          @click="$router.push('/login')"
          class="flex flex-col items-center md:hidden"
        >
          <ProfilIcon class="w-8 h-8" />
        </button>
      </template>
    </div>
  </div>
</template>
