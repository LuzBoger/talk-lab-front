<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import adminService from '../../api/adminService'
import type { PlanFormData } from '../../api/adminService'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Formulaire Plan - Admin',
  meta:[
    {name: 'robots', content: 'noindex, nofollow' },   
  ]
})
const route = useRoute()
const router = useRouter()

const planId = computed(() => {
  return route.params.id ? parseInt(route.params.id as string) : null
})

const isEditing = computed(() => !!planId.value)
const loading = ref(true)
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const formData = ref<PlanFormData>({
  name: '',
  price: '',
  description: '',
})
const errors = ref<Record<string, string>>({})

const fetchPlan = async () => {
  if (!isEditing.value) {
    loading.value = false
    return
  }
  try {
    const response = await adminService.getPlans()
    const plan = response.plans.find((p: any) => p.id === planId.value)
    if (plan) {
      formData.value = {
        name: plan.name,
        price: plan.price,
        description: plan.description,
      }
    } else {
      errorMessage.value = 'Plan non trouvé.'
      setTimeout(() => {
        router.push('/admin/plans')
      }, 2000)
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du plan:', error)
    errorMessage.value = 'Une erreur est survenue lors du chargement du plan.'
  } finally {
    loading.value = false
  }
}

const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!formData.value.name) {
    errors.value.name = 'Le nom du plan est requis.'
    isValid = false
  } else if (formData.value.name.length < 2) {
    errors.value.name = 'Le nom doit contenir au moins 2 caractères.'
    isValid = false
  }

  if (!formData.value.price) {
    errors.value.price = 'Le prix est requis.'
    isValid = false
  } else {
    const price = parseFloat(formData.value.price)
    if (isNaN(price) || price < 0) {
      errors.value.price = 'Le prix doit être un nombre positif.'
      isValid = false
    }
  }

  if (!formData.value.description) {
    errors.value.description = 'La description est requise.'
    isValid = false
  } else if (formData.value.description.length < 10) {
    errors.value.description =
      'La description doit contenir au moins 10 caractères.'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isEditing.value && planId.value) {
      await adminService.updatePlan(planId.value, formData.value)
      successMessage.value = 'Le plan a été mis à jour avec succès.'
    } else {
      await adminService.createPlan(formData.value)
      successMessage.value = 'Le plan a été créé avec succès.'
      setTimeout(() => {
        router.push('/admin/plans')
      }, 1500)
    }
  } catch (error: any) {
    console.error("Erreur lors de l'enregistrement du plan:", error)
    errorMessage.value =
      error.response?.data?.message ||
      "Une erreur est survenue lors de l'enregistrement du plan."
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchPlan()
})
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 min-h-screen bg-gray- text-gray-100">
    <h1 class="mb-8 text-2xl font-bold text-center">
      {{ isEditing ? 'Modifier' : 'Créer' }} un plan d'abonnement
    </h1>

    <div
      v-if="successMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-green-600 text-white text-center font-semibold"
    >
      {{ successMessage }}
    </div>
    <div
      v-if="errorMessage"
      class="mb-4 rounded-lg px-4 py-3 bg-red-600 text-white text-center font-semibold"
    >
      {{ errorMessage }}
    </div>

    <div class="rounded-xl bg-gray-800 shadow-lg p-6">
      <form @submit.prevent="submitForm" v-if="!loading" class="space-y-6">
        <div>
          <label for="name" class="block mb-2 font-semibold">Nom du plan</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            :class="[
              'w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500',
              errors.name && 'border-red-500',
            ]"
            required
          />
          <div v-if="errors.name" class="text-red-400 mt-1 text-sm">
            {{ errors.name }}
          </div>
        </div>

        <div>
          <label for="price" class="block mb-2 font-semibold">Prix (€)</label>
          <div class="flex items-center">
            <input
              type="number"
              step="0.01"
              min="0"
              id="price"
              v-model="formData.price"
              :class="[
                'w-full px-4 py-2 rounded-l-lg bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500',
                errors.price && 'border-red-500',
              ]"
              required
            />
            <span
              class="inline-flex items-center px-3 py-2 rounded-r-lg bg-gray-700 border-t border-b border-r border-gray-700 text-gray-200"
              >€</span
            >
          </div>
          <div v-if="errors.price" class="text-red-400 mt-1 text-sm">
            {{ errors.price }}
          </div>
        </div>

        <div>
          <label for="description" class="block mb-2 font-semibold"
            >Description</label
          >
          <textarea
            id="description"
            rows="5"
            v-model="formData.description"
            :class="[
              'w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-y min-h-[120px]',
              errors.description && 'border-red-500',
            ]"
            required
          ></textarea>
          <div v-if="errors.description" class="text-red-400 mt-1 text-sm">
            {{ errors.description }}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <router-link
            to="/admin/plans"
            class="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg px-6 py-3 transition"
          >
            Retour à la liste
          </router-link>
          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-6 py-3 transition disabled:opacity-60"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
            ></span>
            {{ isEditing ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </form>

      <div v-else class="flex flex-col items-center justify-center py-8">
        <span
          class="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mb-4"
        ></span>
        <span class="text-gray-300">Chargement...</span>
      </div>
    </div>
  </div>
</template>
