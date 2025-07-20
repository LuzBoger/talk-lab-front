<script setup lang="ts">
import { type PropType } from 'vue'

interface User {
  id: number
  name: string
  email: string
  hasSubscription: boolean
  subscriptionStatus?: string | null
  planName?: string | null
}

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits([
  'viewSubscription',
  'cancelSubscription',
  'deleteSubscription',
])

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
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-100">
        Liste des Utilisateurs ({{ users.length }})
      </h2>
    </div>
    <div
      class="bg-card-bg border border-gray-700 rounded-lg shadow overflow-x-auto"
    >
      <table class="min-w-full text-sm text-left text-gray-200">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="px-4 py-3 font-semibold">ID</th>
            <th class="px-4 py-3 font-semibold">Nom</th>
            <th class="px-4 py-3 font-semibold">Email</th>
            <th class="px-4 py-3 font-semibold">Abonnement</th>
            <th class="px-4 py-3 font-semibold">Statut</th>
            <th class="px-4 py-3 font-semibold">Plan</th>
            <th class="px-4 py-3 font-semibold text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-700 hover:bg-gray-700/30 transition"
          >
            <td class="px-4 py-3">{{ user.id }}</td>
            <td class="px-4 py-3">{{ user.name }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                :class="
                  user.hasSubscription
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-900 text-gray-200 border border-gray-600'
                "
                class="inline-block px-3 py-1 rounded-full font-medium text-xs"
              >
                {{ user.hasSubscription ? 'Oui' : 'Non' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                v-if="user.subscriptionStatus"
                :class="{
                  'bg-green-600 text-white':
                    user.subscriptionStatus === 'active',
                  'bg-yellow-400 text-gray-900':
                    user.subscriptionStatus === 'expired',
                  'bg-red-600 text-white':
                    user.subscriptionStatus === 'canceled',
                  'bg-gray-700 text-white': ![
                    'active',
                    'expired',
                    'canceled',
                  ].includes(user.subscriptionStatus || ''),
                }"
                class="inline-block px-3 py-1 rounded-full font-medium text-xs"
              >
                {{ formatStatus(user.subscriptionStatus) }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="px-4 py-3">{{ user.planName || '-' }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-2 justify-end">
                <button
                  v-if="user.hasSubscription"
                  class="px-3 py-1 rounded bg-publish-button hover:bg-publish-button-hover cursor-pointer text-white font-semibold text-xs transition"
                  @click="emit('viewSubscription', user.id)"
                >
                  Détails
                </button>
                <button
                  v-if="
                    user.hasSubscription && user.subscriptionStatus === 'active'
                  "
                  class="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900 cursor-pointer font-semibold text-xs transition"
                  @click="emit('cancelSubscription', user)"
                >
                  Annuler
                </button>
               
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
