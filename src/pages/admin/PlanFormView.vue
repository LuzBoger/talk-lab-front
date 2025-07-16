<template>
  <div class="admin-container">
    <h1 class="mb-4">{{ isEditing ? 'Modifier' : 'Créer' }} un plan d'abonnement</h1>
    
    <div class="alert alert-success" v-if="successMessage">
      {{ successMessage }}
    </div>
    
    <div class="alert alert-danger" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    
    <div class="card shadow">
      <div class="card-body">
        <form @submit.prevent="submitForm" v-if="!loading">
          <div class="mb-3">
            <label for="name" class="form-label">Nom du plan</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="formData.name"
              :class="{ 'is-invalid': errors.name }"
              required
            >
            <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
          </div>
          
          <div class="mb-3">
            <label for="price" class="form-label">Prix (€)</label>
            <div class="input-group">
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                class="form-control" 
                id="price" 
                v-model="formData.price"
                :class="{ 'is-invalid': errors.price }"
                required
              >
              <span class="input-group-text">€</span>
              <div class="invalid-feedback" v-if="errors.price">{{ errors.price }}</div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea 
              class="form-control" 
              id="description" 
              rows="5" 
              v-model="formData.description"
              :class="{ 'is-invalid': errors.description }"
              required
            ></textarea>
            <div class="invalid-feedback" v-if="errors.description">{{ errors.description }}</div>
           
          </div>
          
          <div class="d-flex justify-content-between">
            <router-link to="/admin/plans" class="btn btn-secondary">
              <i class="fas fa-arrow-left"></i> Retour à la liste
            </router-link>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <i class="fas fa-save" v-else></i> {{ isEditing ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
        
        <div v-else class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import adminService from '../../api/adminService';
import type { PlanFormData } from '../../api/adminService';

export default defineComponent({
  name: 'PlanFormView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const planId = computed(() => {
      return route.params.id ? parseInt(route.params.id as string) : null;
    });
    
    const isEditing = computed(() => !!planId.value);
    const loading = ref(true);
    const isSubmitting = ref(false);
    const successMessage = ref('');
    const errorMessage = ref('');
    const formData = ref<PlanFormData>({
      name: '',
      price: '',
      description: ''
    });
    const errors = ref<Record<string, string>>({});
    
    const fetchPlan = async () => {
      if (!isEditing.value) {
        loading.value = false;
        return;
      }
      
      try {
        const response = await adminService.getPlans();
        const plan = response.plans.find((p: any) => p.id === planId.value);
        
        if (plan) {
          formData.value = {
            name: plan.name,
            price: plan.price,
            description: plan.description
          };
        } else {
          errorMessage.value = "Plan non trouvé.";
          setTimeout(() => {
            router.push('/admin/plans');
          }, 2000);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du plan:', error);
        errorMessage.value = "Une erreur est survenue lors du chargement du plan.";
      } finally {
        loading.value = false;
      }
    };
    
    const validateForm = (): boolean => {
      errors.value = {};
      let isValid = true;
      
      if (!formData.value.name) {
        errors.value.name = "Le nom du plan est requis.";
        isValid = false;
      } else if (formData.value.name.length < 2) {
        errors.value.name = "Le nom doit contenir au moins 2 caractères.";
        isValid = false;
      }
      
      if (!formData.value.price) {
        errors.value.price = "Le prix est requis.";
        isValid = false;
      } else {
        const price = parseFloat(formData.value.price);
        if (isNaN(price) || price < 0) {
          errors.value.price = "Le prix doit être un nombre positif.";
          isValid = false;
        }
      }
      
      if (!formData.value.description) {
        errors.value.description = "La description est requise.";
        isValid = false;
      } else if (formData.value.description.length < 10) {
        errors.value.description = "La description doit contenir au moins 10 caractères.";
        isValid = false;
      }
      
      return isValid;
    };
    
    const submitForm = async () => {
      if (!validateForm()) {
        return;
      }
      
      isSubmitting.value = true;
      errorMessage.value = '';
      successMessage.value = '';
      
      try {
        if (isEditing.value && planId.value) {
          await adminService.updatePlan(planId.value, formData.value);
          successMessage.value = "Le plan a été mis à jour avec succès.";
        } else {
          await adminService.createPlan(formData.value);
          successMessage.value = "Le plan a été créé avec succès.";
          
          setTimeout(() => {
            router.push('/admin/plans');
          }, 1500);
        }
      } catch (error: any) {
        console.error('Erreur lors de l\'enregistrement du plan:', error);
        errorMessage.value = error.response?.data?.message || 
          "Une erreur est survenue lors de l'enregistrement du plan.";
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(() => {
      fetchPlan();
    });
    
    return {
      formData,
      errors,
      loading,
      isSubmitting,
      isEditing,
      successMessage,
      errorMessage,
      submitForm
    };
  }
});
</script>

<style scoped>
@import '../../styles/admin.css';

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-check-input {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border-auth-button);
  border-radius: 4px;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.form-check-input:checked {
  background-color: var(--color-main-color);
  border-color: var(--color-main-color);
}

.form-check-label {
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 0.9rem;
}

textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-main-color);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.btn-link:hover {
  color: var(--color-main-color-hover);
}
</style> 