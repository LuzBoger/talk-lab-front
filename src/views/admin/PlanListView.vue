<template>
  <div class="admin-container">
    <h1 class="mb-4">Gestion des plans d'abonnement</h1>

    <div class="d-flex justify-content-end mb-3">
      <router-link to="/admin/plans/new" class="btn btn-success">
        <i class="fas fa-plus-circle"></i> Nouveau plan
      </router-link>
    </div>

    <div class="alert alert-success" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="card shadow">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped" v-if="!loading && plans.length">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prix</th>
                <th>Description</th>
                <th>Abonnés actifs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in plans" :key="plan.id">
                <td>{{ plan.id }}</td>
                <td>{{ plan.name }}</td>
                <td>{{ formatPrice(plan.price) }} €</td>
                <td>
                  <div v-html="formatDescription(plan.description)"></div>
                </td>
                <td>{{ getActiveSubscribersCount(plan) }}</td>
                <td>
                  <div class="btn-group">
                    <router-link 
                      :to="`/admin/plans/${plan.id}/edit`" 
                      class="btn btn-sm btn-outline-primary"
                    >
                      <i class="fas fa-edit"></i> Modifier
                    </router-link>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="confirmDeletePlan(plan)"
                    >
                      <i class="fas fa-trash"></i> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <p>Aucun plan d'abonnement trouvé.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmation de suppression</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedPlan">
            <p>Êtes-vous sûr de vouloir supprimer le plan <strong>{{ selectedPlan.name }}</strong> ?</p>
            <p class="text-danger">Cette action est irréversible.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="deletePlan" 
              :disabled="isDeleting"
            >
              <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import adminService from '../../api/adminService';

interface Subscription {
  status: string;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
  subscriptions?: Subscription[];
}

export default defineComponent({
  name: 'PlanListView',
  setup() {
    const plans = ref<Plan[]>([]);
    const loading = ref(true);
    const successMessage = ref('');
    const errorMessage = ref('');
    const selectedPlan = ref<Plan | null>(null);
    const isDeleting = ref(false);
    const deleteModal = ref<HTMLElement | null>(null);
    let modalInstance: Modal | null = null;

    const fetchPlans = async () => {
      loading.value = true;
      try {
        const response = await adminService.getPlans();
        plans.value = response.plans;
      } catch (error) {
        errorMessage.value = "Une erreur est survenue lors du chargement des plans.";
        console.error('Erreur lors du chargement des plans:', error);
      } finally {
        loading.value = false;
      }
    };

    const getActiveSubscribersCount = (plan: Plan): number => {
      if (!plan.subscriptions) return 0;
      
      return plan.subscriptions.filter(subscription => 
        subscription.status === 'active'
      ).length;
    };

    const formatPrice = (price: string): string => {
      return parseFloat(price).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    const formatDescription = (description: string): string => {
      return description ? description.replace(/\n/g, '<br>') : '';
    };

    const confirmDeletePlan = (plan: Plan) => {
      selectedPlan.value = plan;
      if (modalInstance) {
        modalInstance.show();
      }
    };

    const deletePlan = async () => {
      if (!selectedPlan.value) return;
      
      isDeleting.value = true;
      try {
        await adminService.deletePlan(selectedPlan.value.id);
        successMessage.value = `Le plan "${selectedPlan.value.name}" a été supprimé avec succès.`;
        
        if (modalInstance) {
          modalInstance.hide();
        }
        
        fetchPlans();
      } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 
          "Une erreur est survenue lors de la suppression du plan.";
      } finally {
        isDeleting.value = false;
      }
    };

    onMounted(() => {
      fetchPlans();
      
      if (deleteModal.value) {
        modalInstance = new Modal(deleteModal.value);
      }
    });

    return {
      plans,
      loading,
      successMessage,
      errorMessage,
      selectedPlan,
      isDeleting,
      deleteModal,
      getActiveSubscribersCount,
      formatPrice,
      formatDescription,
      confirmDeletePlan,
      deletePlan
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

.btn-group {
  display: flex;
  gap: 5px;
}
</style> 