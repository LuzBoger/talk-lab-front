<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
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
import LoginIcon from './icon/LoginIcon.vue'
import ConnexionIcon from './icon/ConnexionIcon.vue'
import InscriptionIcon from './icon/InscriptionIcon.vue'
const emit = defineEmits(['sidebar-toggle', 'logout'])
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const showProfileMenu = ref<boolean>(false)
const showMobileMenu = ref<boolean>(false)
const baseUrl = import.meta.env.VITE_BASE_URL

const isProfileRoute = computed(() => {
  return route.path.startsWith('/profil')
})
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const logoutMobile = async () => {
  showMobileMenu.value = false
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

watch(route, () => {
  showMobileMenu.value = false
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
    class="max-md:hidden flex h-screen bg-sidebar-bg flex-col justify-between text-text-primary w-16 md:w-72 p-2 md:p-5 transition-all duration-300"
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
          <DropdownButton
            label="Profil"
            to="/profil"
            @click="showProfileMenu = false"
          >
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
          class="border border-signup-button text-signup-button p-2.5 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-signup-button hover:text-white w-full hidden md:flex items-center justify-center"
        >
          S'inscrire
        </button>
        <button
          @click="$router.push('/login')"
          class="border border-text-primary text-text-primary p-2.5 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-auth-button-hover hover:text-white w-full hidden md:flex items-center justify-center"
        >
          Se connecter
        </button>

        <button
          @click="$router.push('/register')"
          class="border border-signup-button text-signup-button p-2 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-signup-button hover:text-white w-full md:hidden flex items-center justify-center"
          aria-label="S'inscrire"
        >
          <InscriptionIcon
            :width="24"
            :height="24"
            fillColor="#e3e3e3"
            className="h-6 w-6"
          />
        </button>
        <button
          @click="$router.push('/login')"
          class="border border-text-primary text-text-primary p-2 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-auth-button-hover hover:text-white w-full md:hidden flex items-center justify-center"
          aria-label="Se connecter"
        >
          <ConnexionIcon
            :width="24"
            :height="24"
            fillColor="#e3e3e3"
            className="h-6 w-6"
          />
        </button>
      </template>
    </div>
  </div>

     <!-- Bottom Bar Mobile (visible uniquement sur mobile) -->
   <div
     class="max-md:block hidden fixed bottom-0 left-0 right-0 bg-sidebar-bg/95 backdrop-blur-md border-t border-border-auth-button z-50 pb-safe"
   >
     <nav v-if="isProfileRoute" class="grid grid-cols-5 gap-1 py-3 px-2 min-h-[75px]">
       <router-link
         to="/profil/mes-informations"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px]"
         :class="route.path === '/profil/mes-informations' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <ProfilIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Infos</span>
       </router-link>

       <router-link
         to="/profil/mes-conversations"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px]"
         :class="route.path === '/profil/mes-conversations' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <MyCreationIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Créations</span>
       </router-link>

       <router-link
         to="/profil/mes-favoris"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px]"
         :class="route.path === '/profil/mes-favoris' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <TarificationIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Favoris</span>
       </router-link>

       <router-link
         to="/profil/securite"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px]"
         :class="route.path === '/profil/securite' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <CategoriesIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Paramètres</span>
       </router-link>

       <router-link
         to="/"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 text-text-primary hover:text-main-color hover:bg-main-color/5 min-h-[58px]"
       >
         <HomeIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Retour</span>
       </router-link>
     </nav>

     <nav v-else class="flex justify-around items-center py-3 px-2 min-h-[75px]">
       <router-link
         to="/"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
         :class="route.path === '/' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <HomeIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Accueil</span>
       </router-link>

       <router-link
         v-if="authStore.isAuthenticated && !isAdmin"
         to="/decouverte"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
         :class="route.path === '/decouverte' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <MyCreationIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Découverte</span>
       </router-link>

       <router-link
         v-if="!isAdmin"
         to="/create-conversation"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
         :class="route.path === '/create-conversation' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <CreateDiscussionIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Créer</span>
       </router-link>

       <router-link
         v-if="isAdmin"
         to="/admin"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
         :class="route.path.startsWith('/admin') ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <CategoriesIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Admin</span>
       </router-link>

       <button
         v-if="isAdmin"
         @click="logoutMobile"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 text-text-primary hover:text-main-color hover:bg-main-color/5 min-h-[58px] flex-1"
       >
         <LogoutIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Déconnexion</span>
       </button>

       <div
         v-if="authStore.isAuthenticated && !isAdmin"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[58px] flex-1"
         :class="showMobileMenu ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
         @click="showMobileMenu = !showMobileMenu"
       >
         <svg class="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24">
           <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
         </svg>
         <span class="text-[10px] font-medium">Plus</span>
         
         <div
           v-if="showMobileMenu"
           class="absolute bottom-full right-0 mb-2 bg-dropdown-bg rounded-xl shadow-lg py-2 min-w-48 z-50 backdrop-blur-sm"
         >
          <router-link
            to="/subscription/plans"
            class="flex items-center px-4 py-3 text-text-primary hover:bg-card-bg transition-colors"
            @click="showMobileMenu = false"
          >
            <TarificationIcon class="w-5 h-5 mr-3" />
            <span>Tarification</span>
          </router-link>
          <router-link
            to="/my-subscription"
            class="flex items-center px-4 py-3 text-text-primary hover:bg-card-bg transition-colors"
            @click="showMobileMenu = false"
          >
            <SubscriptionIcon class="w-5 h-5 mr-3" />
            <span>Mon Abonnement</span>
          </router-link>
          <router-link
            to="/profil/mes-notifications"
            class="flex items-center px-4 py-3 text-text-primary hover:bg-card-bg transition-colors"
            @click="showMobileMenu = false"
          >
            <CategoriesIcon class="w-5 h-5 mr-3" />
            <span>Notifications</span>
          </router-link>
          <button
            @click="logoutMobile"
            class="flex items-center w-full px-4 py-3 text-text-primary hover:bg-card-bg transition-colors"
          >
            <LogoutIcon class="w-5 h-5 mr-3" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

       <router-link
         v-if="!authStore.isAuthenticated"
         to="/subscription/plans"
         class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
         :class="route.path === '/subscription/plans' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
       >
         <TarificationIcon class="w-5 h-5 mb-1" />
         <span class="text-[10px] font-medium">Tarification</span>
       </router-link>

       <template v-if="authStore.isAuthenticated">
         <router-link
           to="/profil/mes-informations"
           class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
           :class="route.path.startsWith('/profil') ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
         >
           <img
             class="w-5 h-5 rounded-full object-cover border border-avatar-border mb-1"
             :src="avatarUrl"
             alt="Profil"
           />
           <span class="text-[10px] font-medium">Profil</span>
         </router-link>
       </template>
       <template v-else>
         <router-link
           to="/login"
           class="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-h-[58px] flex-1"
           :class="route.path === '/login' ? 'text-main-color bg-main-color/10 shadow-sm' : 'text-text-primary hover:text-main-color hover:bg-main-color/5'"
         >
           <ConnexionIcon class="w-5 h-5 mb-1" />
           <span class="text-[10px] font-medium">Connexion</span>
         </router-link>
       </template>
    </nav>
  </div>
</template>
