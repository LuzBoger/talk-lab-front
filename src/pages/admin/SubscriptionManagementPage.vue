<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import adminSubscriptionService from '../../api/adminSubscriptionService'
import type {
  User,
  Subscription,
  UserSubscription,
} from '../../api/adminSubscriptionService'
import AdminUsersTable from '../../components/admin/AdminUsersTable.vue'
import AdminSubscriptionsTable from '../../components/admin/AdminSubscriptionsTable.vue'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Gestion des abonnements - Admin',
  meta:[
    {name: 'robots', content: 'noindex, nofollow' },   
  ]
})


export default defineComponent({
  name: 'SubscriptionManagementPage',
  components: {
    AdminUsersTable,
    AdminSubscriptionsTable,
  },
  setup() {
    const activeTab = ref('users')
    const users = ref<User[]>([])
    const subscriptions = ref<Subscription[]>([])
    const loadingUsers = ref(false)
    const loadingSubscriptions = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    const showUserSubscriptionModal = ref(false)
    const selectedUserSubscription = ref<UserSubscription | null>(null)

    const showConfirmModal = ref(false)
    const confirmAction = ref<{
      title: string
      message: string
      action: () => Promise<void>
    } | null>(null)

    const loadUsers = async () => {
      try {
        loadingUsers.value = true
        users.value = await adminSubscriptionService.getUsers()
      } catch (error) {
        errorMessage.value = 'Erreur lors du chargement des utilisateurs'
        console.error('Erreur:', error)
      } finally {
        loadingUsers.value = false
      }
    }

    const loadSubscriptions = async () => {
      try {
        loadingSubscriptions.value = true
        subscriptions.value = await adminSubscriptionService.getSubscriptions()
      } catch (error) {
        errorMessage.value = 'Erreur lors du chargement des abonnements'
        console.error('Erreur:', error)
      } finally {
        loadingSubscriptions.value = false
      }
    }

    const viewUserSubscription = async (userId: number) => {
      try {
        selectedUserSubscription.value =
          await adminSubscriptionService.getUserSubscription(userId)
        showUserSubscriptionModal.value = true
      } catch (error) {
        errorMessage.value =
          "Erreur lors du chargement des détails de l'abonnement"
        console.error('Erreur:', error)
      }
    }

    const confirmCancelUserSubscription = (user: User) => {
      confirmAction.value = {
        title: "Annuler l'abonnement",
        message: `Êtes-vous sûr de vouloir annuler l'abonnement de ${user.name} (${user.email}) ?`,
        action: () => cancelUserSubscription(user),
      }
      showConfirmModal.value = true
    }

    const confirmDeleteUserSubscription = (user: User) => {
      confirmAction.value = {
        title: "Supprimer l'abonnement",
        message: `Êtes-vous sûr de vouloir supprimer définitivement l'abonnement de ${user.name} (${user.email}) ? Cette action est irréversible.`,
        action: () => deleteUserSubscription(user),
      }
      showConfirmModal.value = true
    }

    const confirmCancelSubscription = (subscription: Subscription) => {
      confirmAction.value = {
        title: "Annuler l'abonnement",
        message: `Êtes-vous sûr de vouloir annuler l'abonnement ${subscription.plan.name} (ID: ${subscription.id}) ?`,
        action: () => cancelSubscription(subscription.id),
      }
      showConfirmModal.value = true
    }

    const confirmDeleteSubscription = (subscription: Subscription) => {
      confirmAction.value = {
        title: "Supprimer l'abonnement",
        message: `Êtes-vous sûr de vouloir supprimer définitivement l'abonnement ${subscription.plan.name} (ID: ${subscription.id}) ? Cette action est irréversible.`,
        action: () => deleteSubscription(subscription.id),
      }
      showConfirmModal.value = true
    }

    const cancelUserSubscription = async (user: User) => {
      try {
        successMessage.value = ''
        errorMessage.value = ''

        const userSubscription =
          await adminSubscriptionService.getUserSubscription(user.id)
        await adminSubscriptionService.cancelSubscription(userSubscription.id)
        successMessage.value = `Abonnement de ${user.name} annulé avec succès`
        await loadUsers()
        await loadSubscriptions()
      } catch (error: any) {
        errorMessage.value =
          error.message || "Erreur lors de l'annulation de l'abonnement"
        console.error('Erreur:', error)
      }
    }

    const deleteUserSubscription = async (user: User) => {
      try {
        successMessage.value = ''
        errorMessage.value = ''

        const userSubscription =
          await adminSubscriptionService.getUserSubscription(user.id)
        await adminSubscriptionService.deleteSubscription(userSubscription.id)
        successMessage.value = `Abonnement de ${user.name} supprimé avec succès`
        await loadUsers()
        await loadSubscriptions()
      } catch (error: any) {
        errorMessage.value =
          error.message || "Erreur lors de la suppression de l'abonnement"
        console.error('Erreur:', error)
      }
    }

    const cancelSubscription = async (subscriptionId: number) => {
      try {
        successMessage.value = ''
        errorMessage.value = ''

        await adminSubscriptionService.cancelSubscription(subscriptionId)
        successMessage.value = 'Abonnement annulé avec succès'
        await loadUsers()
        await loadSubscriptions()
      } catch (error: any) {
        errorMessage.value =
          error.message || "Erreur lors de l'annulation de l'abonnement"
        console.error('Erreur:', error)
      }
    }

    const deleteSubscription = async (subscriptionId: number) => {
      try {
        successMessage.value = ''
        errorMessage.value = ''

        await adminSubscriptionService.deleteSubscription(subscriptionId)
        successMessage.value = 'Abonnement supprimé avec succès'
        await loadUsers()
        await loadSubscriptions()
      } catch (error: any) {
        errorMessage.value =
          error.message || "Erreur lors de la suppression de l'abonnement"
        console.error('Erreur:', error)
      }
    }

    const executeAction = async () => {
      if (confirmAction.value && confirmAction.value.action) {
        await confirmAction.value.action()
        showConfirmModal.value = false
        confirmAction.value = null

        if (successMessage.value) {
          setTimeout(() => {
            successMessage.value = ''
          }, 5000)
        }
      }
    }

    const formatStatus = (status: string) => {
      switch (status) {
        case 'active':
          return 'Actif'
        case 'canceled':
          return 'Annulé'
        case 'expired':
          return 'Expiré'
        default:
          return status
      }
    }

    onMounted(() => {
      loadUsers()
      loadSubscriptions()
    })

    return {
      activeTab,
      users,
      subscriptions,
      loadingUsers,
      loadingSubscriptions,
      successMessage,
      errorMessage,
      showUserSubscriptionModal,
      selectedUserSubscription,
      showConfirmModal,
      confirmAction,
      viewUserSubscription,
      confirmCancelUserSubscription,
      confirmDeleteUserSubscription,
      confirmCancelSubscription,
      confirmDeleteSubscription,
      executeAction,
      formatStatus,
    }
  },
})
</script>
<template>
  <div class="min-h-screen text-gray-100 px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <div class="mb-10">
        <h1 class="mb-8 text-2xl font-bold">Gestion des abonnements</h1>
        <p class="text-gray-300">
          Gérez les abonnements de tous les utilisateurs
        </p>
      </div>

      <div class="flex justify-center gap-4 mb-8">
        <button
          class="px-6 py-2 rounded-lg font-semibold transition text-base cursor-pointer"
          :class="
            activeTab === 'users'
              ? 'bg-validate-button hover:bg-validate-button-hover text-white'
              : 'bg-validate-button hover:bg-validate-button-hover text-white'
          "
          @click="activeTab = 'users'"
        >
          Utilisateurs
        </button>
        <button
          class="px-6 py-2 rounded-lg font-semibold transition text-base cursor-pointer"
          :class="
            activeTab === 'subscriptions'
              ? 'bg-publish-button hover:bg-publish-button-hover text-white'
              : 'bg-publish-button hover:bg-publish-button-hover text-white'
          "
          @click="activeTab = 'subscriptions'"
        >
          Abonnements
        </button>
      </div>

      <div
        v-if="successMessage"
        class="mb-4 rounded-lg px-4 py-3 bg-green-600 text-white text-center font-semibold"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="errorMessage"
        class="mb-4 rounded-lg px-4 py-3 bg-red-600 text-white text-center font-semibold"
      >
        {{ errorMessage }}
      </div>

      <!-- Onglet Utilisateurs -->
      <div v-if="activeTab === 'users'">
        <div v-if="loadingUsers" class="flex flex-col items-center py-12">
          <span
            class="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mb-4"
          ></span>
          <p class="text-gray-300">Chargement des utilisateurs...</p>
        </div>
        <AdminUsersTable
          v-else
          :users="users"
          @viewSubscription="viewUserSubscription"
          @cancelSubscription="confirmCancelUserSubscription"
          @deleteSubscription="confirmDeleteUserSubscription"
        />
      </div>

      <!-- Onglet Abonnements -->
      <div v-if="activeTab === 'subscriptions'">
        <div
          v-if="loadingSubscriptions"
          class="flex flex-col items-center py-12"
        >
          <span
            class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
          ></span>
          <p class="text-gray-300">Chargement des abonnements...</p>
        </div>
        <AdminSubscriptionsTable
          v-else
          :subscriptions="subscriptions"
          @cancelSubscription="confirmCancelSubscription"
          @deleteSubscription="confirmDeleteSubscription"
        />
      </div>

      <!-- Modal Détail Abonnement Utilisateur -->
      <div
        v-if="showUserSubscriptionModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click="showUserSubscriptionModal = false"
      >
        <div
          class="bg-card-bg rounded-xl shadow-lg w-full max-w-lg mx-4"
          @click.stop
        >
          <div
            class="px-6 py-4 border-b border-gray-700 flex items-center justify-between rounded-t-xl"
          >
            <h3 class="text-lg font-bold text-gray-100">
              Détails de l'abonnement
            </h3>
            <button
              @click="showUserSubscriptionModal = false"
              class="text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none cursor-pointer"
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>
          <div class="px-6 py-6">
            <div v-if="selectedUserSubscription" class="space-y-3">
              <p>
                <span class="font-semibold">Utilisateur :</span>
                {{ selectedUserSubscription.user.name }} ({{
                  selectedUserSubscription.user.email
                }})
              </p>
              <p>
                <span class="font-semibold">Plan :</span>
                {{ selectedUserSubscription.plan.name }}
              </p>
              <p>
                <span class="font-semibold">Prix :</span>
                {{ selectedUserSubscription.plan.price }} €/mois
              </p>
              <p>
                <span class="font-semibold">Durée :</span>
                {{ selectedUserSubscription.duration }} jours
              </p>
              <p>
                <span class="font-semibold">Statut :</span>
                <span
                  class="inline-block px-3 py-1 rounded-full font-semibold text-xs"
                  :class="{
                    'bg-green-600 text-white':
                      selectedUserSubscription.status === 'active',
                    'bg-yellow-400 text-gray-900':
                      selectedUserSubscription.status === 'expired',
                    'bg-red-600 text-white':
                      selectedUserSubscription.status === 'canceled',
                    'bg-gray-600 text-white': ![
                      'active',
                      'expired',
                      'canceled',
                    ].includes(selectedUserSubscription.status),
                  }"
                >
                  {{ formatStatus(selectedUserSubscription.status) }}
                </span>
              </p>
              <p><span class="font-semibold">Description :</span></p>
              <div
                class="bg-gray-900 border border-gray-700 rounded p-3 text-sm whitespace-pre-line"
              >
                {{ selectedUserSubscription.plan.description }}
              </div>
            </div>
          </div>
          <div
            class="px-6 py-4 border-t border-gray-700 flex justify-end rounded-b-xl"
          >
            <button
              class="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-2 transition cursor-pointer"
              @click="showUserSubscriptionModal = false"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Confirmation -->
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        @click="showConfirmModal = false"
      >
        <div
          class="bg-gray-800 rounded-xl shadow-lg w-full max-w-md mx-4"
          @click.stop
        >
          <div
            class="px-6 py-4 border-b border-gray-700 flex items-center justify-between rounded-t-xl"
          >
            <h3 class="text-lg font-bold text-gray-100">
              {{ confirmAction?.title }}
            </h3>
            <button
              @click="showConfirmModal = false"
              class="text-gray-400 hover:text-gray-200 text-2xl font-bold focus:outline-none cursor-pointer"
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>
          <div class="px-6 py-6">
            <p>{{ confirmAction?.message }}</p>
          </div>
          <div
            class="px-6 py-4 border-t border-gray-700 flex justify-end gap-3 rounded-b-xl"
          >
            <button
              class="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-2 transition cursor-pointer"
              @click="showConfirmModal = false"
            >
              Annuler
            </button>
            <button
              class="inline-flex items-center justify-center gap-2 bg-cancel-color hover:bg-cancel-hover text-white font-semibold rounded-lg px-6 py-2 transition cursor-pointer"
              @click="executeAction"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
