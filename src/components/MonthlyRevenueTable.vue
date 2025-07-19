<script setup lang="ts">
import { type PropType } from 'vue'

interface MonthlyStat {
  month: string
  revenue: number
}

const props = defineProps({
  monthlyStats: {
    type: Array as PropType<MonthlyStat[]>,
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
      <h5 class="mb-0 text-lg font-bold text-gray-100">
        Évolution des revenus mensuels
      </h5>
    </div>
    <div class="px-6 py-6">
      <div class="overflow-x-auto">
        <table
          class="min-w-full text-sm text-left text-gray-200 border border-gray-700 rounded-lg"
        >
          <thead>
            <tr>
              <th
                v-for="(stat, index) in monthlyStats"
                :key="index"
                class="px-4 py-3 bg-gray-900 font-semibold border-b border-gray-700 first:rounded-tl-lg last:rounded-tr-lg"
              >
                {{ stat.month }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-card-bg">
            <tr class="hover:bg-card-bg/30 transition">
              <td
                v-for="(stat, index) in monthlyStats"
                :key="index"
                class="px-4 py-3 border-b border-gray-700"
              >
                <span class="inline-block font-semibold text-base">
                  {{ formatPrice(stat.revenue) }} €
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
