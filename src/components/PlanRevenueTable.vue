<template>
  <div class="card shadow">
    <div class="card-header">
      <h5 class="mb-0">Revenus par plan</h5>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Revenus</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plan, index) in planRevenue" :key="index">
              <td>{{ plan.name }}</td>
              <td>{{ formatPrice(plan.revenue) }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface PlanRevenue {
  name: string;
  revenue: number;
}

export default defineComponent({
  name: 'PlanRevenueTable',
  props: {
    planRevenue: {
      type: Array as PropType<PlanRevenue[]>,
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