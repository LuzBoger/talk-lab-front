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

    <PlanTable 
      :plans="plans" 
      :loading="loading" 
      @delete="confirmDeletePlan"
    />

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
import PlanTable from '../../components/PlanTable.vue';

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
  components: {
    PlanTable
  },
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
      confirmDeletePlan,
      deletePlan
    };
  }
});
</script>

<style scoped>
@import '../../styles/admin.css';
</style> 