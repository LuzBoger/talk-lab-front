<script setup lang="ts">
import { type PropType } from 'vue'

interface PlanRevenue {
  name: string
  revenue: number
}

const props = defineProps({
  planRevenue: {
    type: Array as PropType<PlanRevenue[]>,
    required: true,
    default: () => [],
  },
})

const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<template>
  <div class="rounded-xl shadow p-0">
    <div class="px-6 py-4 border-b border-gray-700 rounded-t-xl">
      <h5 class="mb-0 text-lg font-bold text-gray-100">Revenus par plan</h5>
    </div>
    <div class="px-6 py-6">
      <div class="overflow-x-auto">
        <table
          class="min-w-full text-sm text-left text-gray-200 border border-gray-700 rounded-lg"
        >
          <thead>
            <tr>
              <th
                class="px-4 py-3 bg-gray-900 font-semibold border-b border-gray-700 first:rounded-tl-lg"
              >
                Plan
              </th>
              <th
                class="px-4 py-3 bg-gray-900 font-semibold border-b border-gray-700 last:rounded-tr-lg"
              >
                Revenus
              </th>
            </tr>
          </thead>
          <tbody class="bg-card-bg">
            <tr
              v-for="(plan, index) in planRevenue"
              :key="index"
              class="hover:bg-gray-700/30 transition"
            >
              <td class="px-4 py-3 border-b border-gray-700">
                <span class="inline-block font-semibold text-base">
                  {{ plan.name }}
                </span>
              </td>
              <td class="px-4 py-3 border-b border-gray-700">
                <span class="inline-block font-semibold text-base">
                  {{ formatPrice(plan.revenue) }} €
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
