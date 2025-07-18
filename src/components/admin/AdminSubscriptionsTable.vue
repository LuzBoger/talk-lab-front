<script setup lang="ts">
import { type PropType } from 'vue'

interface Plan {
  name: string
  price: string
}

interface Subscription {
  id: number
  plan: Plan
  duration: number
  status: string
  users?: any[]
}

const props = defineProps({
  subscriptions: {
    type: Array as PropType<Subscription[]>,
    required: true,
    default: () => [],
  },
})

const emit = defineEmits(['cancelSubscription', 'deleteSubscription'])

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
        Tous les Abonnements ({{ subscriptions.length }})
      </h2>
    </div>
    <div
      class="bg-card-bg border border-gray-700 rounded-lg shadow overflow-x-auto"
    >
      <table class="min-w-full text-sm text-left text-gray-200">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="px-4 py-3 font-semibold">ID</th>
            <th class="px-4 py-3 font-semibold">Plan</th>
            <th class="px-4 py-3 font-semibold">Prix</th>
            <th class="px-4 py-3 font-semibold">Durée</th>
            <th class="px-4 py-3 font-semibold">Statut</th>
            <th class="px-4 py-3 font-semibold">Utilisateurs</th>
            <th class="px-4 py-3 font-semibold text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="subscription in subscriptions"
            :key="subscription.id"
            class="border-b border-gray-700 hover:bg-gray-700/30 transition"
          >
            <td class="px-4 py-3">{{ subscription.id }}</td>
            <td class="px-4 py-3">{{ subscription.plan.name }}</td>
            <td class="px-4 py-3">{{ subscription.plan.price }}€</td>
            <td class="px-4 py-3">{{ subscription.duration }} jours</td>
            <td class="px-4 py-3">
              <span
                :class="{
                  'bg-green-600 text-white': subscription.status === 'active',
                  'bg-yellow-400 text-gray-900':
                    subscription.status === 'expired',
                  'bg-red-600 text-white': subscription.status === 'canceled',
                  'bg-gray-700 text-white': ![
                    'active',
                    'expired',
                    'canceled',
                  ].includes(subscription.status),
                }"
                class="inline-block px-3 py-1 rounded-full font-medium text-xs"
              >
                {{ formatStatus(subscription.status) }}
              </span>
            </td>
            <td class="px-4 py-3">{{ subscription.users?.length || 0 }}</td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-2 justify-end">
                <button
                  v-if="subscription.status === 'active'"
                  class="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-xs transition cursor-pointer"
                  @click="emit('cancelSubscription', subscription)"
                >
                  Annuler
                </button>
                <button
                  class="px-3 py-1 rounded bg-cancel-color hover:bg-cancel-hover text-white font-semibold text-xs transition cursor-pointer"
                  @click="emit('deleteSubscription', subscription)"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
