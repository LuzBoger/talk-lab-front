<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import logoUrl from '../../public/logo.svg'
import defaultProfileImg from '../assets/images/defaultAvatar.png'
import MenuItem from './sidebarComponents/MenuItem.vue'
import HomeIcon from './icon/HomeIcon.vue'
import CategoriesIcon from './icon/CategoriesIcon.vue'
import MyCreationIcon from './icon/MyCreationIcon.vue'
import CreateDiscussionIcon from './icon/CreateDiscussionIcon.vue'
import ForumIcon from './icon/ForumIcon.vue'
import TarificationIcon from './icon/TarificationIcon.vue'
import LogoIcon from './icon/LogoIcon.vue'
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['sidebar-toggle', 'logout'])

const route = useRoute()
const router = useRouter()
const showProfileMenu = ref<boolean>(false)

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

const handleLogout = () => {
  showProfileMenu.value = false
  logout()
}

onMounted(() => {
  console.log('Sidebar component mounted')
})
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <LogoIcon />
    </div>

    <nav class="menu">
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
          <template #icon> <HomeIcon /></template>
          Accueil</MenuItem
        >
        <MenuItem to="/categories" activePath="/categories">
          <template #icon> <CategoriesIcon /></template>
          Catégories</MenuItem
        >
        <MenuItem
          to="/decouverte"
          activePath="/decouverte"
          v-if="props.isLoggedIn"
        >
          <template #icon> <MyCreationIcon /></template>
          Découverte de conversation</MenuItem
        >
        <MenuItem
          to="/conversation/nouvelle"
          activePath="/conversation/nouvelle"
        >
          <template #icon> <CreateDiscussionIcon /></template>
          Créer une discussion</MenuItem
        >
        <MenuItem to="/forum" activePath="/forum">
          <template #icon> <ForumIcon /></template>
          Forum</MenuItem
        >
        <MenuItem to="/tarification" activePath="/tarification">
          <template #icon> <TarificationIcon /></template>
          Tarification</MenuItem
        >
      </template>
    </nav>

    <div class="auth-buttons">
      <template v-if="props.isLoggedIn">
        <div class="dropdown" @click="toggleProfileMenu">
          <img
            class="avatar"
            :src="defaultProfileImg"
            alt="Avatar utilisateur"
          />
          <span class="username">User</span>
        </div>
        <div v-if="showProfileMenu" class="profile-dropdown">
          <button @click="navigateToProfile">Profil</button>
          <button @click="navigateToHelp">Aide</button>
          <button @click="logout">Déconnexion</button>
        </div>
      </template>

      <template v-else>
        <button class="btn-signup" @click="$router.push('/register')">
          S'inscrire
        </button>
        <button class="btn-login" @click="$router.push('/register')">
          Se connecter
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 305px;
  height: 100vh;
  background-color: #1a192c;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: width 0.3s ease;
  z-index: 100;
  color: #e3e3e3;
}

.sidebar-collapsed {
  width: 80px;
}

.toggle-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 110;
  background-color: rgba(26, 25, 44, 0.8);
  border-radius: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: rgba(26, 25, 44, 1);
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.logo img {
  max-width: 100%;
  height: auto;
  user-select: none;
}

.sidebar-collapsed .logo {
  margin-top: 40px;
}

.menu {
  flex-grow: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
  margin-bottom: 8px;
}

.menu-item svg {
  margin-right: 12px;
  flex-shrink: 0;
  fill: #e3e3e3;
  transition: fill 0.2s ease;
}

.menu-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 16px;
}

.menu-item a {
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.menu-item:hover {
  background-color: #2e2b55;
}

.menu-item.active,
.menu-item.active:hover {
  background-color: #444071;
}

.sidebar-collapsed .menu-item span {
  display: none;
}

.sidebar-collapsed .menu-item svg {
  margin-right: 0;
}

.sidebar-collapsed .menu-item a {
  justify-items: center;
}

.auth-buttons {
  padding-top: 20px;
  border-top: 1px solid #2e2b55;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auth-buttons button {
  background-color: transparent;
  border: 1px solid #e3e3e3;
  color: #e3e3e3;
  padding: 10px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.auth-buttons button:hover {
  background-color: #444071;
  color: #fff;
}

.btn-signup {
  border-color: #6c63ff;
  color: #6c63ff;
}

.btn-signup:hover {
  background-color: #6c63ff;
  color: white;
}

.btn-login {
  border-color: #e3e3e3;
  color: #e3e3e3;
}

.dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 6px;
  user-select: none;
  background-color: #2e2b55;
  transition: background-color 0.3s ease;
}

.dropdown:hover {
  background-color: #444071;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #6c63ff;
}
.sidebar-collapsed .avatar {
  width: 100%;
}

.sidebar-collapsed .username {
  display: none;
}

.username {
  font-weight: 600;
  color: #e3e3e3;
  white-space: nowrap;
}

.profile-dropdown {
  margin-top: 8px;
  background-color: #2e2b55;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  position: absolute;
  bottom: 85px;
  width: 150px;
  z-index: 120;
}

.profile-dropdown button {
  background: none;
  border: none;
  color: #e3e3e3;
  padding: 10px 20px;
  text-align: left;
  width: 100%;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.profile-dropdown button:hover {
  background-color: #444071;
}
</style>
