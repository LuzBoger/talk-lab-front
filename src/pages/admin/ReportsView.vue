<template>
  <div class="admin-container">
    <h1 class="mb-5 text-center">Rapports d'abonnement</h1>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else>
      <div class="row mb-5">
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card shadow-lg h-100 stats-card">
            <div class="card-body text-center">
              <h4 class="mb-3 card-title">Abonnements actifs</h4>
              <div class="display-4 text-primary mb-3 stats-number">{{ reports.activeSubscriptions || 0 }}</div>
              <p class="text-muted">Nombre total d'abonnements actifs</p>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card shadow-lg h-100 stats-card">
            <div class="card-body text-center">
              <h4 class="mb-3 card-title">Revenus mensuels</h4>
              <div class="display-4 text-success mb-3 stats-number">{{ formatPrice(reports.currentMonthRevenue || 0) }} €</div>
              <p class="text-muted">Total des revenus pour le mois en cours</p>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4 col-md-12 mb-4">
          <div class="card shadow-lg h-100 stats-card">
            <div class="card-body text-center">
              <h4 class="mb-3 card-title">Taux de conversion</h4>
              <div class="display-4 text-info mb-3 stats-number">{{ formatPercent(reports.conversionRate || 0) }}%</div>
              <p class="text-muted">Pourcentage d'utilisateurs avec un abonnement actif</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mb-5" v-if="(reports.monthlyStats && reports.monthlyStats.length) || (reports.planRevenue && reports.planRevenue.length)">
        <div class="col-lg-8 col-md-12 mb-4" v-if="reports.monthlyStats && reports.monthlyStats.length">
          <MonthlyRevenueTable :monthlyStats="reports.monthlyStats" />
        </div>
        
        <div class="col-lg-4 col-md-12 mb-4" v-if="reports.planRevenue && reports.planRevenue.length">
          <PlanRevenueTable :planRevenue="reports.planRevenue" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import adminService from '../../api/adminService';
import MonthlyRevenueTable from '../../components/MonthlyRevenueTable.vue';
import PlanRevenueTable from '../../components/PlanRevenueTable.vue';

export default defineComponent({
  name: 'ReportsView',
  components: {
    MonthlyRevenueTable,
    PlanRevenueTable
  },
  setup() {
    const loading = ref(true);
    const errorMessage = ref('');
    const reports = ref<any>({});
    
    const fetchReports = async () => {
      loading.value = true;
      try {
        const data = await adminService.getReports();
        reports.value = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des rapports:', error);
        errorMessage.value = "Une erreur est survenue lors du chargement des rapports.";
      } finally {
        loading.value = false;
      }
    };
    
    const formatPrice = (price: number): string => {
      return price.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };
    
    const formatPercent = (value: number): string => {
      return value.toLocaleString('fr-FR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      });
    };
    
    onMounted(() => {
      fetchReports();
    });
    
    return {
      loading,
      errorMessage,
      reports,
      formatPrice,
      formatPercent
    };
  }
});
</script>

<style scoped>
@import '../../styles/admin.css';

.display-4 {
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
}

.text-primary {
  color: var(--color-main-color) !important;
}

.text-success {
  color: var(--color-validate-button) !important;
}

.text-info {
  color: var(--color-publish-button) !important;
}

.text-muted {
  color: rgba(227, 227, 227, 0.6) !important;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.stats-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  border-radius: 12px;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
}

.stats-number {
  font-weight: 600;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.row .col-lg-8,
.row .col-lg-4 {
  display: flex;
  flex-direction: column;
}

.row .col-lg-8 .card,
.row .col-lg-4 .card {
  flex: 1;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .row .col-lg-8,
  .row .col-lg-4 {
    margin-bottom: 2rem;
  }
}

@media (max-width: 576px) {
  .stats-card {
    margin-bottom: 1.5rem;
  }
  
  .display-4 {
    font-size: 1.8rem;
  }
}
</style> 