<script lang="ts" setup>
import { type PropType } from 'vue'
import EditIcon from './icon/EditIcon.vue'
import BinIcon from './icon/BinIcon.vue'

interface Subscription {
  status: string
}

interface Plan {
  id: number
  name: string
  price: string
  description: string
  subscriptions?: Subscription[]
}

const props = defineProps<{
  plans: Plan[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'delete', plan: Plan): void
}>()

const getActiveSubscribersCount = (plan: Plan): number => {
  if (!plan.subscriptions) return 0
  return plan.subscriptions.filter(
    (subscription) => subscription.status === 'active',
  ).length
}

const formatPrice = (price: string): string => {
  return parseFloat(price).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatDescription = (description: string): string => {
  return description ? description.replace(/\n/g, '<br>') : ''
}
</script>

<template>
  <div class="rounded-xl bg-card-bg shadow-lg p-0 overflow-x-auto">
    <div class="p-0">
      <table
        v-if="!loading && plans.length"
        class="min-w-full divide-y divide-gray-700"
      >
        <thead class="bg-card-bg">
          <tr>
            <th
              class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
            >
              ID
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
            >
              Nom
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
            >
              Prix
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
            >
              Description
            </th>
            <th
              class="py-3 px-4 text-left text-xs font-semibold text-gray-300 uppercase"
            >
              Abonnés actifs
            </th>
            <th
              class="py-3 px-4 text-right text-xs font-semibold text-gray-300 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-700/30">
            <td class="py-3 px-4">{{ plan.id }}</td>
            <td class="py-3 px-4">{{ plan.name }}</td>
            <td class="py-3 px-4">{{ formatPrice(plan.price) }} €</td>
            <td class="py-3 px-4">
              <div v-html="formatDescription(plan.description)"></div>
            </td>
            <td class="py-3 px-4">{{ getActiveSubscribersCount(plan) }}</td>
            <td class="py-3 px-4">
              <div class="flex justify-end gap-2">
                <router-link
                  :to="`/admin/plans/${plan.id}/edit`"
                  class="inline-flex items-center gap-2 bg-publish-button hover:bg-publish-button-hover text-white font-semibold rounded px-4 py-2 text-sm transition"
                >
                  <EditIcon
                    :width="16"
                    :height="16"
                    fillColor="#fff"
                    className="w-4 h-4"
                  />
                </router-link>
                <button
                  class="inline-flex items-center gap-2 bg-cancel-color hover:bg-cancel-hover cursor-pointer text-white font-semibold rounded px-4 py-2 text-sm transition"
                  @click="$emit('delete', plan)"
                >
                  <BinIcon
                    :width="16"
                    :height="16"
                    fillColor="#fff"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="loading" class="text-center py-8">
        <div
          class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <span class="text-gray-300">Chargement...</span>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-gray-400">Aucun plan d'abonnement trouvé.</p>
      </div>
    </div>
  </div>
</template>
