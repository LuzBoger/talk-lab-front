<template>
  <div class="admin-container">
    <h1 class="mb-4">Rapports d'abonnement</h1>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else>
      <div class="row">
        <div class="col-md-4">
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h4 class="mb-3">Abonnements actifs</h4>
              <div class="display-4 text-primary mb-3">{{ reports.activeSubscriptions || 0 }}</div>
              <p class="text-muted">Nombre total d'abonnements actifs</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h4 class="mb-3">Revenus mensuels</h4>
              <div class="display-4 text-success mb-3">{{ formatPrice(reports.currentMonthRevenue || 0) }} €</div>
              <p class="text-muted">Total des revenus pour le mois en cours</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h4 class="mb-3">Taux de conversion</h4>
              <div class="display-4 text-info mb-3">{{ formatPercent(reports.conversionRate || 0) }}%</div>
              <p class="text-muted">Pourcentage d'utilisateurs avec un abonnement actif</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-4" v-if="reports.monthlyStats && reports.monthlyStats.length">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header">
              <h5 class="mb-0">Évolution des revenus mensuels</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Revenus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(stat, index) in reports.monthlyStats" :key="index">
                      <td>{{ stat.month }}</td>
                      <td>{{ formatPrice(stat.revenue) }} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-4" v-if="reports.planRevenue && reports.planRevenue.length">
        <div class="col-md-12">
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
                    <tr v-for="(plan, index) in reports.planRevenue" :key="index">
                      <td>{{ plan.name }}</td>
                      <td>{{ formatPrice(plan.revenue) }} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import adminService from '../../api/adminService';

export default defineComponent({
  name: 'ReportsView',
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

/* Styles spécifiques aux rapports */
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

.table-bordered {
  border: 1px solid var(--color-border-auth-button);
}

.table-bordered th,
.table-bordered td {
  border: 1px solid var(--color-border-auth-button);
}
</style> 