<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import logoUrl from '../../public/logo.svg';
import defaultProfileImg from '../assets/images/defaultAvatar.png'
import { useNotificationsStore } from '../stores/useNotificationsStore';
import {useAuthStore} from '../stores/useAuthStore';
import authService from '../api/authService';


const emit = defineEmits(['sidebar-toggle', 'logout']);
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const route = useRoute();
const router = useRouter()
const isCollapsed = ref<boolean>(false)
const showProfileMenu = ref<boolean>(false)
const username = ref<string>('');



const unReadCount = computed(() => {
  return notificationsStore.countUnReadNotifications ;
})

const routeActive  = computed(() => (path: string) => {
  return route.path === path || route.path.startsWith(path)
})

const isProfileRoute  = computed(() => {
  return route.path.startsWith('/profil')
})

const toggleSidebar = () =>  {
      console.log('toggleSidebar called');
      isCollapsed.value = !isCollapsed.value;
      console.log('isCollapsed:', isCollapsed.value);
      emit('sidebar-toggle', isCollapsed.value);
}

const logout = async  () => {
  await authStore.logout()
  router.push('/login');
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const navigateToProfile = () => {
  router.push('/profil');
  showProfileMenu.value = false
}

const navigateToHelp = () => {
  router.push('/aide');
  showProfileMenu.value = false
}


const handleLogout = () => {
  showProfileMenu.value = false
  logout()
}

const handleResize = () => {
  if(window.innerWidth < 768 && !isCollapsed.value) {
    isCollapsed.value = true
    emit('sidebar-toggle', isCollapsed.value);
  } else if(window.innerWidth >= 768 && isCollapsed.value) {
    isCollapsed.value = false
    emit('sidebar-toggle', isCollapsed.value);
  }
}

const user = computed(() => {
  return authStore.user?.username || 'Utilisateur'
})

const avatarurl = computed(() => {
  return authStore.user?.avatar || defaultProfileImg
})

watch(() => authStore.isAuthenticated, (newVal) => {
  console.log('isAuthenticated changed:', newVal);
});
onMounted(async () => {
  handleResize(); 
  window.addEventListener('resize', handleResize);
  console.log('Sidebar component mounted');
});
</script>



<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="toggle-button" @click="toggleSidebar">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          v-if="isCollapsed" />
        <path d="M6 18L18 6M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          v-else="!isCollapsed" />
      </svg>
    </div>

    <div class="logo">
      <img :src="logoUrl" alt="TalkLabs Logo" />
    </div>

    <nav class="menu">

      <template v-if="isProfileRoute">
        <div class="menu-item" :class="{ active: routeActive('/profil/mes-informations')}">
          <RouterLink to="/profil/mes-informations">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 9C7.7625 9 6.70312 8.55937 5.82187 7.67812C4.94062 6.79688 4.5 5.7375 4.5 4.5C4.5 3.2625 4.94062 2.20312 5.82187 1.32187C6.70312 0.440625 7.7625 0 9 0C10.2375 0 11.2969 0.440625 12.1781 1.32187C13.0594 2.20312 13.5 3.2625 13.5 4.5C13.5 5.7375 13.0594 6.79688 12.1781 7.67812C11.2969 8.55937 10.2375 9 9 9ZM0 18V14.85C0 14.2125 0.164062 13.6266 0.492188 13.0922C0.820312 12.5578 1.25625 12.15 1.8 11.8687C2.9625 11.2875 4.14375 10.8516 5.34375 10.5609C6.54375 10.2703 7.7625 10.125 9 10.125C10.2375 10.125 11.4562 10.2703 12.6562 10.5609C13.8562 10.8516 15.0375 11.2875 16.2 11.8687C16.7437 12.15 17.1797 12.5578 17.5078 13.0922C17.8359 13.6266 18 14.2125 18 14.85V18H0ZM2.25 15.75H15.75V14.85C15.75 14.6437 15.6984 14.4562 15.5953 14.2875C15.4922 14.1187 15.3562 13.9875 15.1875 13.8937C14.175 13.3875 13.1531 13.0078 12.1219 12.7547C11.0906 12.5016 10.05 12.375 9 12.375C7.95 12.375 6.90937 12.5016 5.87812 12.7547C4.84687 13.0078 3.825 13.3875 2.8125 13.8937C2.64375 13.9875 2.50781 14.1187 2.40469 14.2875C2.30156 14.4562 2.25 14.6437 2.25 14.85V15.75ZM9 6.75C9.61875 6.75 10.1484 6.52969 10.5891 6.08906C11.0297 5.64844 11.25 5.11875 11.25 4.5C11.25 3.88125 11.0297 3.35156 10.5891 2.91094C10.1484 2.47031 9.61875 2.25 9 2.25C8.38125 2.25 7.85156 2.47031 7.41094 2.91094C6.97031 3.35156 6.75 3.88125 6.75 4.5C6.75 5.11875 6.97031 5.64844 7.41094 6.08906C7.85156 6.52969 8.38125 6.75 9 6.75Z" fill="#E3E3E3"/>
            </svg>
            <span>Mes informations</span>
          </RouterLink>
        </div>

        <div class="menu-item" :class="{ active: routeActive('/profil/mes-conversations')}">
          <RouterLink to="/profil/mes-conversations">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 18V0H18V18H0ZM15 14H3V15.5H15V14ZM3 12.5H15V11H3V12.5ZM3 9H15V3H3V9Z" fill="#E3E3E3"/>
            </svg>
            <span>Mes Créations</span>
          </RouterLink>
        </div>

        <div class="menu-item" :class="{ active: routeActive('/profil/mes-favoris')}">
          <RouterLink to="/profil/mes-favoris">
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.7577L7.695 15.5877C6.18 14.2227 4.9275 13.0452 3.9375 12.0552C2.9475 11.0652 2.16 10.1764 1.575 9.38893C0.99 8.60143 0.58125 7.87768 0.34875 7.21768C0.11625 6.55768 0 5.88268 0 5.19268C0 3.78268 0.4725 2.60518 1.4175 1.66018C2.3625 0.715176 3.54 0.242676 4.95 0.242676C5.73 0.242676 6.4725 0.407676 7.1775 0.737676C7.8825 1.06768 8.49 1.53268 9 2.13268C9.51 1.53268 10.1175 1.06768 10.8225 0.737676C11.5275 0.407676 12.27 0.242676 13.05 0.242676C14.46 0.242676 15.6375 0.715176 16.5825 1.66018C17.5275 2.60518 18 3.78268 18 5.19268C18 5.88268 17.8838 6.55768 17.6513 7.21768C17.4188 7.87768 17.01 8.60143 16.425 9.38893C15.84 10.1764 15.0525 11.0652 14.0625 12.0552C13.0725 13.0452 11.82 14.2227 10.305 15.5877L9 16.7577ZM9 14.3277C10.44 13.0377 11.625 11.9314 12.555 11.0089C13.485 10.0864 14.22 9.28393 14.76 8.60143C15.3 7.91893 15.675 7.31143 15.885 6.77893C16.095 6.24643 16.2 5.71768 16.2 5.19268C16.2 4.29268 15.9 3.54268 15.3 2.94268C14.7 2.34268 13.95 2.04268 13.05 2.04268C12.345 2.04268 11.6925 2.24143 11.0925 2.63893C10.4925 3.03643 10.08 3.54268 9.855 4.15768H8.145C7.92 3.54268 7.5075 3.03643 6.9075 2.63893C6.3075 2.24143 5.655 2.04268 4.95 2.04268C4.05 2.04268 3.3 2.34268 2.7 2.94268C2.1 3.54268 1.8 4.29268 1.8 5.19268C1.8 5.71768 1.905 6.24643 2.115 6.77893C2.325 7.31143 2.7 7.91893 3.24 8.60143C3.78 9.28393 4.515 10.0864 5.445 11.0089C6.375 11.9314 7.56 13.0377 9 14.3277Z" fill="#E3E3E3"/>
            </svg>
            <span>Mes Favoris</span>
          </RouterLink>
        </div>

        <div class="menu-item" :class="{ active: routeActive('/profil/mes-notifications')}">
          <RouterLink to="/profil/mes-notifications">
            <svg fill="#000000" height="24" width="18" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612.00 612.00" xml:space="preserve">
              <path d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203 C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578 c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626 h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856 c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626 C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32 c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082 c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826 c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485 c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"></path> <path d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258 c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258 C323.259,126.96,315.532,119.235,306.001,119.235z"></path>
            </svg>
            <span>Mes Notifications</span>
          </RouterLink>
        </div>

        <div class="menu-item" :class="{ active: routeActive('/profil/parametres')}">
          <RouterLink to="/profil/securite">
            <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 23.25C6.39375 22.5938 4.24219 21.0984 2.54531 18.7641C0.848438 16.4297 0 13.8375 0 10.9875V4.125L9 0.75L18 4.125V10.9875C18 13.8375 17.1516 16.4297 15.4547 18.7641C13.7578 21.0984 11.6062 22.5938 9 23.25ZM9 20.8875C10.8188 20.325 12.3375 19.2141 13.5563 17.5547C14.775 15.8953 15.4875 14.0438 15.6937 12H9V3.14063L2.25 5.67188V11.4938C2.25 11.625 2.26875 11.7938 2.30625 12H9V20.8875Z" fill="#E3E3E3"/>
            </svg>
            <span>Sécurite & Confidentialité</span>
          </RouterLink>
        </div>
      </template>
    
      <template v-else>
      <div class="menu-item" :class="{ active: routeActive('/') && route.path === '/'}">
        <RouterLink to="/">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 24H7.5V15H16.5V24H21V10.5L12 3.75L3 10.5V24ZM0 27V9L12 0L24 9V27H13.5V18H10.5V27H0Z"
              fill="white" />
          </svg>
          <span>Accueil</span>
        </RouterLink>
      </div>

      <div class="menu-item" :class="{active: routeActive('/categories')}">
        <RouterLink to="/categories">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1875 21.5625 14.3125 20.6875C13.4375 19.8125 13 18.75 13 17.5C13 16.25 13.4375 15.1875 14.3125 14.3125C15.1875 13.4375 16.25 13 17.5 13C18.75 13 19.8125 13.4375 20.6875 14.3125C21.5625 15.1875 22 16.25 22 17.5C22 18.75 21.5625 19.8125 20.6875 20.6875C19.8125 21.5625 18.75 22 17.5 22ZM3 21.5V13.5H11V21.5H3ZM17.5 20C18.2 20 18.7917 19.7583 19.275 19.275C19.7583 18.7917 20 18.2 20 17.5C20 16.8 19.7583 16.2083 19.275 15.725C18.7917 15.2417 18.2 15 17.5 15C16.8 15 16.2083 15.2417 15.725 15.725C15.2417 16.2083 15 16.8 15 17.5C15 18.2 15.2417 18.7917 15.725 19.275C16.2083 19.7583 16.8 20 17.5 20ZM5 19.5H9V15.5H5V19.5ZM10.05 9H13.95L12 5.85L10.05 9Z"
              fill="#E3E3E3" />
          </svg>
          <span>Catégories</span>
        </RouterLink>
      </div>

      <div v-if="authStore.isAuthenticated" class="menu-item" :class="{active: routeActive('/decouverte')}">
        <RouterLink to="/decouverte">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21V3H21V21H3ZM18 17H6V18.5H18V17ZM6 15.5H18V14H6V15.5ZM6 12H18V6H6V12Z" fill="#E3E3E3" />
          </svg>
          <span>Découverte de conversation</span>
        </RouterLink>
      </div>

      <div class="menu-item" :class="{active: routeActive('/conversation/nouvelle')}">
         <RouterLink to="/conversation/nouvelle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 20V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V10.075C18.8333 10.0417 18.6667 10.0208 18.5 10.0125C18.3333 10.0042 18.1667 10 18 10C17.8333 10 17.6667 10.0042 17.5 10.0125C17.3333 10.0208 17.1667 10.0417 17 10.075V5H5V15H12.075C12.0417 15.1667 12.0208 15.3333 12.0125 15.5C12.0042 15.6667 12 15.8333 12 16C12 16.1667 12.0042 16.3333 12.0125 16.5C12.0208 16.6667 12.0417 16.8333 12.075 17H6L3 20ZM7 9H15V7H7V9ZM7 13H12V11H7V13ZM17 20V17H14V15H17V12H19V15H22V17H19V20H17Z"
              fill="#E3E3E3" />
          </svg>
          <span>Créer une discussion</span>
        </RouterLink>
      </div>

      <div class="menu-item" :class="{active: routeActive('/forum')}">
        <RouterLink to="/forum">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_128_164)">
            <path
              d="M0 18V16.425C0 15.7083 0.366667 15.125 1.1 14.675C1.83333 14.225 2.8 14 4 14C4.21667 14 4.425 14.0042 4.625 14.0125C4.825 14.0208 5.01667 14.0417 5.2 14.075C4.96667 14.425 4.79167 14.7917 4.675 15.175C4.55833 15.5583 4.5 15.9583 4.5 16.375V18H0ZM6 18V16.375C6 15.8417 6.14583 15.3542 6.4375 14.9125C6.72917 14.4708 7.14167 14.0833 7.675 13.75C8.20833 13.4167 8.84583 13.1667 9.5875 13C10.3292 12.8333 11.1333 12.75 12 12.75C12.8833 12.75 13.6958 12.8333 14.4375 13C15.1792 13.1667 15.8167 13.4167 16.35 13.75C16.8833 14.0833 17.2917 14.4708 17.575 14.9125C17.8583 15.3542 18 15.8417 18 16.375V18H6ZM19.5 18V16.375C19.5 15.9417 19.4458 15.5333 19.3375 15.15C19.2292 14.7667 19.0667 14.4083 18.85 14.075C19.0333 14.0417 19.2208 14.0208 19.4125 14.0125C19.6042 14.0042 19.8 14 20 14C21.2 14 22.1667 14.2208 22.9 14.6625C23.6333 15.1042 24 15.6917 24 16.425V18H19.5ZM8.125 16H15.9C15.7333 15.6667 15.2708 15.375 14.5125 15.125C13.7542 14.875 12.9167 14.75 12 14.75C11.0833 14.75 10.2458 14.875 9.4875 15.125C8.72917 15.375 8.275 15.6667 8.125 16ZM4 13C3.45 13 2.97917 12.8042 2.5875 12.4125C2.19583 12.0208 2 11.55 2 11C2 10.4333 2.19583 9.95833 2.5875 9.575C2.97917 9.19167 3.45 9 4 9C4.56667 9 5.04167 9.19167 5.425 9.575C5.80833 9.95833 6 10.4333 6 11C6 11.55 5.80833 12.0208 5.425 12.4125C5.04167 12.8042 4.56667 13 4 13ZM20 13C19.45 13 18.9792 12.8042 18.5875 12.4125C18.1958 12.0208 18 11.55 18 11C18 10.4333 18.1958 9.95833 18.5875 9.575C18.9792 9.19167 19.45 9 20 9C20.5667 9 21.0417 9.19167 21.425 9.575C21.8083 9.95833 22 10.4333 22 11C22 11.55 21.8083 12.0208 21.425 12.4125C21.0417 12.8042 20.5667 13 20 13ZM12 12C11.1667 12 10.4583 11.7083 9.875 11.125C9.29167 10.5417 9 9.83333 9 9C9 8.15 9.29167 7.4375 9.875 6.8625C10.4583 6.2875 11.1667 6 12 6C12.85 6 13.5625 6.2875 14.1375 6.8625C14.7125 7.4375 15 8.15 15 9C15 9.83333 14.7125 10.5417 14.1375 11.125C13.5625 11.7083 12.85 12 12 12ZM12 10C12.2833 10 12.5208 9.90417 12.7125 9.7125C12.9042 9.52083 13 9.28333 13 9C13 8.71667 12.9042 8.47917 12.7125 8.2875C12.5208 8.09583 12.2833 8 12 8C11.7167 8 11.4792 8.09583 11.2875 8.2875C11.0958 8.47917 11 8.71667 11 9C11 9.28333 11.0958 9.52083 11.2875 9.7125C11.4792 9.90417 11.7167 10 12 10Z"
              fill="#E3E3E3" />
          </g>
          <defs>
            <clipPath id="clip0_128_164">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span>Forum</span>
        </RouterLink>
      </div>

      <div class="menu-item" :class="{active: routeActive('/tarification')}">
        <RouterLink to="/tarification">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM7 16C6.45 16 5.97917 15.8042 5.5875 15.4125C5.19583 15.0208 5 14.55 5 14V6C5 5.45 5.19583 4.97917 5.5875 4.5875C5.97917 4.19583 6.45 4 7 4H21C21.55 4 22.0208 4.19583 22.4125 4.5875C22.8042 4.97917 23 5.45 23 6V14C23 14.55 22.8042 15.0208 22.4125 15.4125C22.0208 15.8042 21.55 16 21 16H7ZM9 14H19C19 13.45 19.1958 12.9792 19.5875 12.5875C19.9792 12.1958 20.45 12 21 12V8C20.45 8 19.9792 7.80417 19.5875 7.4125C19.1958 7.02083 19 6.55 19 6H9C9 6.55 8.80417 7.02083 8.4125 7.4125C8.02083 7.80417 7.55 8 7 8V12C7.55 12 8.02083 12.1958 8.4125 12.5875C8.80417 12.9792 9 13.45 9 14ZM20 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V7H3V18H20V20Z"
            fill="#E3E3E3" />
        </svg>
        <span>Tarification</span>
        </RouterLink>
      </div>
    </template>
    
    </nav>

    <div class="auth-buttons">
      <template v-if="authStore.isAuthenticated">
        <div class="dropdown" @click="toggleProfileMenu">
          <div class="avatar-container">
          <img class="avatar" :src="avatarurl" alt="Avatar utilisateur">
                <div v-if="unReadCount > 0" class="notification-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span class="red-dot"></span>
      </div>
      </div>
          <span class="username">{{ user }}</span>
        </div>
        <div v-if="showProfileMenu" class="profile-dropdown">
          <button @click="navigateToProfile">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.465 13.59C4.23 13.005 5.085 12.5438 6.03 12.2063C6.975 11.8688 7.965 11.7 9 11.7C10.035 11.7 11.025 11.8688 11.97 12.2063C12.915 12.5438 13.77 13.005 14.535 13.59C15.06 12.975 15.4688 12.2775 15.7613 11.4975C16.0538 10.7175 16.2 9.885 16.2 9C16.2 7.005 15.4988 5.30625 14.0963 3.90375C12.6938 2.50125 10.995 1.8 9 1.8C7.005 1.8 5.30625 2.50125 3.90375 3.90375C2.50125 5.30625 1.8 7.005 1.8 9C1.8 9.885 1.94625 10.7175 2.23875 11.4975C2.53125 12.2775 2.94 12.975 3.465 13.59ZM9 9.9C8.115 9.9 7.36875 9.59625 6.76125 8.98875C6.15375 8.38125 5.85 7.635 5.85 6.75C5.85 5.865 6.15375 5.11875 6.76125 4.51125C7.36875 3.90375 8.115 3.6 9 3.6C9.885 3.6 10.6313 3.90375 11.2388 4.51125C11.8463 5.11875 12.15 5.865 12.15 6.75C12.15 7.635 11.8463 8.38125 11.2388 8.98875C10.6313 9.59625 9.885 9.9 9 9.9ZM9 18C7.755 18 6.585 17.7638 5.49 17.2913C4.395 16.8188 3.4425 16.1775 2.6325 15.3675C1.8225 14.5575 1.18125 13.605 0.70875 12.51C0.23625 11.415 0 10.245 0 9C0 7.755 0.23625 6.585 0.70875 5.49C1.18125 4.395 1.8225 3.4425 2.6325 2.6325C3.4425 1.8225 4.395 1.18125 5.49 0.70875C6.585 0.23625 7.755 0 9 0C10.245 0 11.415 0.23625 12.51 0.70875C13.605 1.18125 14.5575 1.8225 15.3675 2.6325C16.1775 3.4425 16.8188 4.395 17.2913 5.49C17.7638 6.585 18 7.755 18 9C18 10.245 17.7638 11.415 17.2913 12.51C16.8188 13.605 16.1775 14.5575 15.3675 15.3675C14.5575 16.1775 13.605 16.8188 12.51 17.2913C11.415 17.7638 10.245 18 9 18ZM9 16.2C9.795 16.2 10.545 16.0837 11.25 15.8513C11.955 15.6188 12.6 15.285 13.185 14.85C12.6 14.415 11.955 14.0813 11.25 13.8488C10.545 13.6163 9.795 13.5 9 13.5C8.205 13.5 7.455 13.6163 6.75 13.8488C6.045 14.0813 5.4 14.415 4.815 14.85C5.4 15.285 6.045 15.6188 6.75 15.8513C7.455 16.0837 8.205 16.2 9 16.2ZM9 8.1C9.39 8.1 9.7125 7.9725 9.9675 7.7175C10.2225 7.4625 10.35 7.14 10.35 6.75C10.35 6.36 10.2225 6.0375 9.9675 5.7825C9.7125 5.5275 9.39 5.4 9 5.4C8.61 5.4 8.2875 5.5275 8.0325 5.7825C7.7775 6.0375 7.65 6.36 7.65 6.75C7.65 7.14 7.7775 7.4625 8.0325 7.7175C8.2875 7.9725 8.61 8.1 9 8.1Z" fill="#E3E3E3"/>
            </svg>
            Profil
          </button>
          <button @click="navigateToHelp">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.955 14.4C9.27 14.4 9.53625 14.2913 9.75375 14.0738C9.97125 13.8563 10.08 13.59 10.08 13.275C10.08 12.96 9.97125 12.6938 9.75375 12.4763C9.53625 12.2588 9.27 12.15 8.955 12.15C8.64 12.15 8.37375 12.2588 8.15625 12.4763C7.93875 12.6938 7.83 12.96 7.83 13.275C7.83 13.59 7.93875 13.8563 8.15625 14.0738C8.37375 14.2913 8.64 14.4 8.955 14.4ZM8.145 10.935H9.81C9.81 10.44 9.86625 10.05 9.97875 9.765C10.0913 9.48 10.41 9.09 10.935 8.595C11.325 8.205 11.6325 7.83375 11.8575 7.48125C12.0825 7.12875 12.195 6.705 12.195 6.21C12.195 5.37 11.8875 4.725 11.2725 4.275C10.6575 3.825 9.93 3.6 9.09 3.6C8.235 3.6 7.54125 3.825 7.00875 4.275C6.47625 4.725 6.105 5.265 5.895 5.895L7.38 6.48C7.455 6.21 7.62375 5.9175 7.88625 5.6025C8.14875 5.2875 8.55 5.13 9.09 5.13C9.57 5.13 9.93 5.26125 10.17 5.52375C10.41 5.78625 10.53 6.075 10.53 6.39C10.53 6.69 10.44 6.97125 10.26 7.23375C10.08 7.49625 9.855 7.74 9.585 7.965C8.925 8.55 8.52 8.9925 8.37 9.2925C8.22 9.5925 8.145 10.14 8.145 10.935ZM9 18C7.755 18 6.585 17.7638 5.49 17.2913C4.395 16.8188 3.4425 16.1775 2.6325 15.3675C1.8225 14.5575 1.18125 13.605 0.70875 12.51C0.23625 11.415 0 10.245 0 9C0 7.755 0.23625 6.585 0.70875 5.49C1.18125 4.395 1.8225 3.4425 2.6325 2.6325C3.4425 1.8225 4.395 1.18125 5.49 0.70875C6.585 0.23625 7.755 0 9 0C10.245 0 11.415 0.23625 12.51 0.70875C13.605 1.18125 14.5575 1.8225 15.3675 2.6325C16.1775 3.4425 16.8188 4.395 17.2913 5.49C17.7638 6.585 18 7.755 18 9C18 10.245 17.7638 11.415 17.2913 12.51C16.8188 13.605 16.1775 14.5575 15.3675 15.3675C14.5575 16.1775 13.605 16.8188 12.51 17.2913C11.415 17.7638 10.245 18 9 18ZM9 16.2C11.01 16.2 12.7125 15.5025 14.1075 14.1075C15.5025 12.7125 16.2 11.01 16.2 9C16.2 6.99 15.5025 5.2875 14.1075 3.8925C12.7125 2.4975 11.01 1.8 9 1.8C6.99 1.8 5.2875 2.4975 3.8925 3.8925C2.4975 5.2875 1.8 6.99 1.8 9C1.8 11.01 2.4975 12.7125 3.8925 14.1075C5.2875 15.5025 6.99 16.2 9 16.2Z" fill="#E3E3E3"/>
            </svg>
            Aide
          </button>
          <button @click="logout">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#EC221F"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </template>
      
      <template v-else>
        <button class="btn-signup" @click="$router.push('/register')">S'inscrire</button>
        <button class="btn-login" @click="$router.push('/login')">Se connecter</button>
      </template>
    </div>
  </div>
</template>



<style scoped>
.sidebar {
  width: 305px;
  height: 100vh;
  background-color: #1A192C;
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
  color: #E3E3E3;
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
  fill: #E3E3E3;
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
  background-color: #2E2B55;
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-buttons .dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.auth-buttons .avatar-container {
  position: relative;
  display: inline-block;
}
.auth-buttons .avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
  margin-right: 8px;
  border-radius: 50%;
}
.notification-badge{
  position: absolute;
  top: -6px;
  right: -2px;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 50%;
  z-index: 10;
  color: #E3E3E3;
}

.sidebar-collapsed .notification-badge {
  right: -8px;
  top: -8px;
}
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.red-dot {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 8px;
  height: 8px;
  background-color: #FF4C4C;
  border-radius: 60%;
  border: 2px solid #1A192C;
  pointer-events: none;
  animation: blink 2s infinite;
}

.auth-buttons .username {
  font-weight: 600;
  font-size: 1rem;
}

.sidebar-collapsed .auth-buttons {
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.btn-signup {
  border-color: #6C63FF;
  color: #6C63FF;
}

.btn-signup:hover {
  background-color: #6C63FF;
  color: white;
}

.btn-login {
  border-color: #E3E3E3;
  color: #E3E3E3;
}

.dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  width: 100%;
  padding: 10px 15px;
  border-radius: 6px;
  user-select: none;
  background-color: #2E2B55;
  transition: background-color 0.3s ease;
}

.dropdown:hover {
  background-color: #444071;
}

.sidebar-collapsed .dropdown {
  flex-direction: column;
  justify-content: center;
  padding: 10px;
}


.sidebar-collapsed .avatar {
  margin-right: 0;
}

.sidebar-collapsed .username {
  display: none;
}

.profile-dropdown {
  background-color: #2E2B55;
  border-radius: 6px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  position: absolute;
  bottom: 65px;
  width: 100%;
  z-index: 120;
}

.sidebar-collapsed .profile-dropdown {
  width: 100%;
  bottom: 70px;

}
.profile-dropdown button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: #E3E3E3;
  padding: 10px 16px;
  text-align: left;
  width: 100%;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.25s ease;
}
.sidebar-collapsed .profile-dropdown button {
  justify-content: center;
  gap: 0;
  font-size: 0;

}

.profile-dropdown button:hover {
  background-color: #444071;
}

</style>