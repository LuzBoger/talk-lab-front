<template>
  <div class="admin-container">
    <h1 class="mb-5 text-center">Tableau de bord administrateur</h1>

    <div class="alert alert-success" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    

    <div class="row mb-5">
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card shadow-lg h-100 stats-card">
          <div class="card-body text-center">
            <h5 class="card-title mb-3">Abonnements actifs</h5>
            <h2 class="stats-number text-primary mb-3">{{ loading ? '...' : stats.activeSubscriptions }}</h2>
            <p class="text-muted mb-0">Nombre total d'abonnements actifs</p>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card shadow-lg h-100 stats-card">
          <div class="card-body text-center">
            <h5 class="card-title mb-3">Revenus du mois</h5>
            <h2 class="stats-number text-success mb-3">{{ loading ? '...' : formatPrice(stats.currentMonthRevenue) }} €</h2>
            <p class="text-muted mb-0">Total des revenus pour le mois en cours</p>
          </div>
        </div>
      </div>

      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card shadow-lg h-100 stats-card">
          <div class="card-body text-center">
            <h5 class="card-title mb-3">Taux de conversion</h5>
            <h2 class="stats-number text-info mb-3">{{ loading ? '...' : formatPercent(stats.conversionRate) }}%</h2>
            <p class="text-muted mb-0">Pourcentage d'utilisateurs avec un abonnement actif</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6 col-md-12 mb-4">
        <div class="card shadow-lg h-100 action-card">
          <div class="card-header bg-gradient">
            <h5 class="mb-0 text-white">
              <i class="fas fa-bolt me-2"></i>Actions rapides
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-3">
              <router-link to="/admin/plans" class="btn btn-primary btn-action">
                <i class="fas fa-cog me-2"></i>Gérer les plans
              </router-link>
              <router-link to="/admin/subscriptions" class="btn btn-info btn-action">
                <i class="fas fa-users me-2"></i>Gérer les abonnements
              </router-link>
              <router-link to="/admin/reports" class="btn btn-secondary btn-action">
                <i class="fas fa-chart-line me-2"></i>Voir les rapports détaillés
              </router-link>
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
@import '../../styles/admin.css';

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
  font-size: 2.5rem;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
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

.action-card {
  border: none;
  border-radius: 12px;
}

.bg-gradient {
  background: linear-gradient(135deg, var(--color-main-color), var(--color-publish-button)) !important;
  border-radius: 12px 12px 0 0;
}

.btn-action {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.welcome-card {
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
}

.welcome-icon {
  font-size: 3rem;
  color: var(--color-main-color);
  opacity: 0.8;
}

.stat-mini i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

@media (max-width: 768px) {
  .admin-container {
    padding: 1rem;
  }
  
  .stats-number {
    font-size: 2rem;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .welcome-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 576px) {
  .stats-card {
    margin-bottom: 1.5rem;
  }
  
  .stats-number {
    font-size: 1.8rem;
  }
  
  .btn-action {
    padding: 0.6rem 1rem;
  }
}
</style> 