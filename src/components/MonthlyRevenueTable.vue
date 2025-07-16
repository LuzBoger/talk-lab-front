<template>
  <div class="card shadow">
    <div class="card-header">
      <h5 class="mb-0">Évolution des revenus mensuels</h5>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th v-for="(stat, index) in monthlyStats" :key="index">{{ stat.month }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(stat, index) in monthlyStats" :key="index">{{ formatPrice(stat.revenue) }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface MonthlyStat {
  month: string;
  revenue: number;
}

export default defineComponent({
  name: 'MonthlyRevenueTable',
  props: {
    monthlyStats: {
      type: Array as PropType<MonthlyStat[]>,
      required: true,
      default: () => []
    }
  },
  setup() {
    const formatPrice = (price: number): string => {
      return price.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    return {
      formatPrice
    };
  }
});
</script>

<style scoped>
@import '../styles/admin.css';

.table-bordered {
  border: 1px solid var(--color-border-auth-button);
}

.table-bordered th,
.table-bordered td {
  border: 1px solid var(--color-border-auth-button);
}
</style> 