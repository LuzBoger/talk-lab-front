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
import LogoIcon from './icon/LogoIcon.vue'
import DropdownButton from './sidebarComponents/dropdownButton/DropdownButton.vue'
import ProfilIcon from './icon/ProfilIcon.vue'
import HelpIcon from './icon/HelpIcon.vue'
import LogoutIcon from './icon/LogoutIcon.vue'
import DropDownButtonLogout from './sidebarComponents/dropdownButton/DropDownButtonLogout.vue';
import { useNotificationsStore } from '../stores/useNotificationsStore';
import {useAuthStore} from '../stores/useAuthStore';
import authService from '../api/authService';

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['sidebar-toggle', 'logout'])

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const route = useRoute();
const router = useRouter()
const showProfileMenu = ref<boolean>(false)
const username = ref<string>('');
const baseUrl= import.meta.env.VITE_BASE_URL;




const unReadCount = computed(() => {
  return notificationsStore.countUnReadNotifications ;
})

const isProfileRoute = computed(() => {
  return route.path.startsWith('/profil')
})

const logout = () => {
  emit('logout')
  router.push('/login')
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const navigateToProfile = () => {
  router.push('/profil')
  showProfileMenu.value = false
}

const navigateToHelp = () => {
  router.push('/aide')
  showProfileMenu.value = false
}

onMounted(() => {
  console.log('Sidebar component mounted')
})
</script>

<template>
  <div
    class="w-72 h-screen bg-sidebar-bg p-5 flex flex-col justify-between text-text-primary"
  >
    <div class="logo flex justify-center mb-10">
      <LogoIcon />
    </div>

    <nav class="flex flex-col flex-1">
      <template v-if="isProfileRoute">
        <MenuItem
          to="/profil/mes-informations"
          activePath="/profil/mes-informations"
        >
          Mes informations
        </MenuItem>
        <MenuItem
          to="/profil/mes-conversations"
          activePath="/profil/mes-conversations"
        >
          Mes Créations
        </MenuItem>
        <MenuItem to="/profil/mes-favoris" activePath="/profil/mes-favoris">
          Mes Favoris
        </MenuItem>
        <MenuItem to="/profil/securite" activePath="/profil/securite">
          Mes Paramètres
        </MenuItem>
      </template>
      <template v-else>
        <MenuItem to="/" activePath="/">
          <template #icon><HomeIcon /></template>
          Accueil
        </MenuItem>
        <MenuItem to="/categories" activePath="/categories">
          <template #icon><CategoriesIcon /></template>
          Catégories
        </MenuItem>
        <MenuItem
          to="/decouverte"
          activePath="/decouverte"
          v-if="props.isLoggedIn"
        >
          <template #icon><MyCreationIcon /></template>
          Découverte de conversation
        </MenuItem>
        <MenuItem
          to="/conversation/nouvelle"
          activePath="/conversation/nouvelle"
        >
          <template #icon><CreateDiscussionIcon /></template>
          Créer une discussion
        </MenuItem>
        <MenuItem to="/forum" activePath="/forum">
          <template #icon><ForumIcon /></template>
          Forum
        </MenuItem>
        <MenuItem to="/tarification" activePath="/tarification">
          <template #icon><TarificationIcon /></template>
          Tarification
        </MenuItem>
      </template>
    </nav>

    <div class="pt-5 border-t border-border-auth-button flex flex-col gap-2.5">
      <template v-if="props.isLoggedIn">
        <div
          class="flex items-center cursor-pointer gap-2.5 p-2.5 rounded-lg bg-dropdown-bg transition-colors duration-300"
          @click="toggleProfileMenu"
        >
          <img
            class="w-9 h-9 rounded-full object-cover flex-shrink-0 border-2 border-avatar-border"
            :src="defaultProfileImg"
            alt="Avatar utilisateur"
          />
          <span class="font-semibold text-text-primary whitespace-nowrap"
            >User</span
          >
        </div>
        <div
          v-if="showProfileMenu"
          class="mt-2 bg-dropdown-bg rounded-2xl shadow-lg flex flex-col p-2 absolute bottom-20 w-36 gap-1"
        >
          <DropdownButton label="Profil" to="/profil">
            <template #icon><ProfilIcon /></template>
          </DropdownButton>
          <DropdownButton label="Aide" to="/aide">
            <template #icon><HelpIcon /> </template
          ></DropdownButton>
          <DropDownButtonLogout label="Déconnexion" @action="logout"
            ><template #icon><LogoutIcon /></template
          ></DropDownButtonLogout>
        </div>
      </template>

      <template v-else>
        <button
          @click="$router.push('/register')"
          class="border border-signup-button text-signup-button p-2.5 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-signup-button hover:text-white"
        >
          S'inscrire
        </button>
        <button
          @click="$router.push('/login')"
          class="border border-text-primary text-text-primary p-2.5 font-semibold rounded-lg cursor-pointer transition-colors duration-200 hover:bg-auth-button-hover hover:text-white"
        >
          Se connecter
        </button>
      </template>
    </div>
  </div>
</template>
