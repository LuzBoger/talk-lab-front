<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="toggle-button" @click="toggleSidebar">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-if="isCollapsed"/>
        <path d="M6 18L18 6M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-if="!isCollapsed"/>
      </svg>
    </div>
    
    <div class="logo">
      <img :src="logoUrl" alt="TalkLabs Logo" />
    </div>
    <nav class="menu">
      <div class="menu-item active" @click="navigateTo('/')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 24H7.5V15H16.5V24H21V10.5L12 3.75L3 10.5V24ZM0 27V9L12 0L24 9V27H13.5V18H10.5V27H0Z" fill="white"/>
        </svg>
        <span>Accueil</span>
      </div>
      <div class="menu-item" @click="navigateTo('/categories')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 11L12 2L17.5 11H6.5ZM17.5 22C16.25 22 15.1875 21.5625 14.3125 20.6875C13.4375 19.8125 13 18.75 13 17.5C13 16.25 13.4375 15.1875 14.3125 14.3125C15.1875 13.4375 16.25 13 17.5 13C18.75 13 19.8125 13.4375 20.6875 14.3125C21.5625 15.1875 22 16.25 22 17.5C22 18.75 21.5625 19.8125 20.6875 20.6875C19.8125 21.5625 18.75 22 17.5 22ZM3 21.5V13.5H11V21.5H3ZM17.5 20C18.2 20 18.7917 19.7583 19.275 19.275C19.7583 18.7917 20 18.2 20 17.5C20 16.8 19.7583 16.2083 19.275 15.725C18.7917 15.2417 18.2 15 17.5 15C16.8 15 16.2083 15.2417 15.725 15.725C15.2417 16.2083 15 16.8 15 17.5C15 18.2 15.2417 18.7917 15.725 19.275C16.2083 19.7583 16.8 20 17.5 20ZM5 19.5H9V15.5H5V19.5ZM10.05 9H13.95L12 5.85L10.05 9Z" fill="#E3E3E3"/>
        </svg>
        <span>Catégories</span>
      </div>
      <div class="menu-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21V3H21V21H3ZM18 17H6V18.5H18V17ZM6 15.5H18V14H6V15.5ZM6 12H18V6H6V12Z" fill="#E3E3E3"/>
        </svg>
        <span>Mes créations</span>
      </div>
      <div class="menu-item" @click="navigateTo('/conversation/create')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 20V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V10.075C18.8333 10.0417 18.6667 10.0208 18.5 10.0125C18.3333 10.0042 18.1667 10 18 10C17.8333 10 17.6667 10.0042 17.5 10.0125C17.3333 10.0208 17.1667 10.0417 17 10.075V5H5V15H12.075C12.0417 15.1667 12.0208 15.3333 12.0125 15.5C12.0042 15.6667 12 15.8333 12 16C12 16.1667 12.0042 16.3333 12.0125 16.5C12.0208 16.6667 12.0417 16.8333 12.075 17H6L3 20ZM7 9H15V7H7V9ZM7 13H12V11H7V13ZM17 20V17H14V15H17V12H19V15H22V17H19V20H17Z" fill="#E3E3E3"/>
        </svg>
        <span>Créer une discussion</span>
      </div>
      <div class="menu-item" @click="navigateTo('/subscription/plans')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13ZM7 16C6.45 16 5.97917 15.8042 5.5875 15.4125C5.19583 15.0208 5 14.55 5 14V6C5 5.45 5.19583 4.97917 5.5875 4.5875C5.97917 4.19583 6.45 4 7 4H21C21.55 4 22.0208 4.19583 22.4125 4.5875C22.8042 4.97917 23 5.45 23 6V14C23 14.55 22.8042 15.0208 22.4125 15.4125C22.0208 15.8042 21.55 16 21 16H7ZM9 14H19C19 13.45 19.1958 12.9792 19.5875 12.5875C19.9792 12.1958 20.45 12 21 12V8C20.45 8 19.9792 7.80417 19.5875 7.4125C19.1958 7.02083 19 6.55 19 6H9C9 6.55 8.80417 7.02083 8.4125 7.4125C8.02083 7.80417 7.55 8 7 8V12C7.55 12 8.02083 12.1958 8.4125 12.5875C8.80417 12.9792 9 13.45 9 14ZM20 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V7H3V18H20V20Z" fill="#E3E3E3"/>
        </svg>
        <span>Plans d'abonnement</span>
      </div>
      
      <div class="menu-item" @click="navigateTo('/my-subscription')" v-if="isLoggedIn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#E3E3E3"/>
        </svg>
        <span>Mon abonnement</span>
      </div>

      <template v-if="isAdmin">
        <div class="menu-section" :class="{ 'section-collapsed': isCollapsed }">
          <h3 class="menu-title">Administration</h3>
        </div>
        <div class="menu-item" @click="navigateTo('/admin')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="#E3E3E3"/>
          </svg>
          <span>Tableau de bord</span>
        </div>
        <div class="menu-item" @click="navigateTo('/admin/plans')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 13C13.1667 13 12.4583 12.7083 11.875 12.125C11.2917 11.5417 11 10.8333 11 10C11 9.16667 11.2917 8.45833 11.875 7.875C12.4583 7.29167 13.1667 7 14 7C14.8333 7 15.5417 7.29167 16.125 7.875C16.7083 8.45833 17 9.16667 17 10C17 10.8333 16.7083 11.5417 16.125 12.125C15.5417 12.7083 14.8333 13 14 13Z" fill="#E3E3E3"/>
          </svg>
          <span>Plans</span>
        </div>
        <div class="menu-item" @click="navigateTo('/admin/subscriptions')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="#E3E3E3"/>
          </svg>
          <span>Abonnements</span>
        </div>
        <div class="menu-item" @click="navigateTo('/admin/subscription-management')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" fill="#E3E3E3"/>
            <path d="M15.5 11.5L13 14l-1.5-1.5L10 14l2 2 4-4-0.5-0.5z" fill="#1A192C"/>
          </svg>
          <span>Gestion abonnements</span>
        </div>
        <div class="menu-item" @click="navigateTo('/admin/reports')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#E3E3E3"/>
          </svg>
          <span>Rapports</span>
        </div>
      </template>
    </nav>
    <div class="auth-buttons">
      <template v-if="isLoggedIn">
        <button class="btn-logout" @click="logout">Déconnexion</button>
      </template>
      <template v-else>
        <button class="btn-signup" @click="navigateTo('/register')">S'inscrire</button>
        <button class="btn-login" @click="navigateTo('/login')">Se connecter</button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logoUrl: '/logo.svg',
      isCollapsed: false,
      showAdminSection: false
    }
  },
  methods: {
    toggleSidebar() {
      console.log('toggleSidebar called');
      this.isCollapsed = !this.isCollapsed;
      console.log('isCollapsed:', this.isCollapsed);
      this.$emit('sidebar-toggle', this.isCollapsed);
    },
    navigateTo(path) {
      console.log('navigateTo called with path:', path);
      if (this.$router) {
        this.$router.push(path);
      } else {
        window.location.href = path;
      }
    },
    logout() {
      this.$emit('logout');
      this.navigateTo('/login');
    }
  },
  created() {
    console.log('Sidebar component created');
    console.log('isAdmin initial value:', this.isAdmin);
  },
  mounted() {
    console.log('Sidebar component mounted');
    console.log('isLoggedIn prop:', this.isLoggedIn);
    console.log('isAdmin prop:', this.isAdmin);
  },
  watch: {
    isLoggedIn(newVal) {
      console.log('isLoggedIn changed:', newVal);
    },
    isAdmin: {
      immediate: true,
      handler(newVal) {
        console.log('isAdmin changed:', newVal);
        this.showAdminSection = newVal;
      }
    }
  }
}
</script>

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
  scrollbar-width: thin;
  scrollbar-color: #27273dfd #1A192C;
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #2a2a36;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: #181d1a;
  border-radius: 4px;
  border: 2px solid #2a2a36;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #161d19;
}

.sidebar-collapsed {
  width: 80px;
}

.toggle-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 10;
  background-color: rgba(26, 25, 44, 0.8); 
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-collapsed .logo img {
  width: 50px;
  height: 50px;
}

.sidebar-collapsed .menu-item span,
.sidebar-collapsed .auth-buttons {
  display: none;
}

.sidebar-collapsed .menu-item {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.sidebar-collapsed .menu-item svg {
  margin-left: 0;
}

.logo {
  margin-top: 40px; 
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.logo img {
  width: 70px;
  height: 70px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  gap: 12px;
}

.menu-item span {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.menu-item.active {
  background-color: #2a2a36;
}

.menu-item.active span {
  color: #23CE6B;
}

.menu-item:hover {
  background-color: #2a2a36;
}

.menu-item svg {
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
}

.auth-buttons {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}

.btn-signup, .btn-login, .btn-logout {
  padding: 12px 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  width: 90%;
  max-width: 250px;
  text-align: center;
}

.btn-signup {
  background-color: #23CE6B;
  color: white;
}

.btn-login {
  background-color: transparent;
  border: 1px solid #23CE6B;
  color: #23CE6B;
}

.btn-logout {
  background-color: #dc3545;
  color: white;
}

.sidebar-collapsed .auth-buttons {
  display: none;
}

.sidebar-buttons {
  margin: 15px 0;
}

.sidebar-button {
  margin-bottom: 10px;
  padding: 10px 15px;
  width: calc(100% - 30px);
  margin-left: 15px;
  margin-right: 15px;
}

.menu-section {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #2a2a36;
}

.menu-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.section-collapsed {
  display: none;
}
</style> 