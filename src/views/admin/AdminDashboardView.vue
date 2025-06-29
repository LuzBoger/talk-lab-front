<template>
  <div class="admin-container">
    <h1 class="mb-4">Tableau de bord administrateur</h1>

    <div class="alert alert-success" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="row">
      <div class="col-md-4 mb-4">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title">Abonnements actifs</h5>
            <h2 class="card-text">{{ loading ? '...' : stats.activeSubscriptions }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title">Revenus du mois</h5>
            <h2 class="card-text">{{ loading ? '...' : formatPrice(stats.currentMonthRevenue) }} €</h2>
          </div>
        </div>
      </div>

      <div class="col-md-4 mb-4">
        <div class="card shadow">
          <div class="card-body">
            <h5 class="card-title">Taux de conversion</h5>
            <h2 class="card-text">{{ loading ? '...' : formatPercent(stats.conversionRate) }}%</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="card shadow">
          <div class="card-header">
            <h5 class="mb-0">Actions rapides</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/admin/plans" class="btn btn-primary">
                Gérer les plans
              </router-link>
              <router-link to="/admin/subscriptions" class="btn btn-info">
                Gérer les abonnements
              </router-link>
              <router-link to="/admin/reports" class="btn btn-secondary">
                Voir les rapports détaillés
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-4">
        <div class="card shadow">
          <div class="card-header">
            <h5 class="mb-0">Dernières activités</h5>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            <p v-else class="text-muted">
              Fonctionnalité en développement
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import adminService from '../../api/adminService';

interface DashboardStats {
  activeSubscriptions: number;
  currentMonthRevenue: number;
  conversionRate: number;
}

export default defineComponent({
  name: 'AdminDashboardView',
  setup() {
    const loading = ref(true);
    const successMessage = ref('');
    const errorMessage = ref('');
    const stats = ref<DashboardStats>({
      activeSubscriptions: 0,
      currentMonthRevenue: 0,
      conversionRate: 0
    });

    const fetchStats = async () => {
      try {
        const response = await adminService.getReports();
        stats.value = response;
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        errorMessage.value = 'Impossible de charger les statistiques. Veuillez réessayer.';
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
      fetchStats();
    });

    return {
      loading,
      stats,
      successMessage,
      errorMessage,
      formatPrice,
      formatPercent
    };
  }
});
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  height: 100%;
}

.card-title {
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #212529;
  margin-bottom: 0;
}
</style> 