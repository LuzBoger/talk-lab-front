<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Category } from '../../../types/Category'
import CategoryCreateForm from '../../../components/admin/categories/CategoryCreateForm.vue'
import { addCategory } from '../../../api/category'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Création des catégories - Admin',
  meta:[
    {name: 'robots', content: 'noindex, nofollow' },   
  ]
})
const router = useRouter()


const form = ref<Category>({
  name: '',
  shortName: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    if (!form.value.name.trim()) {
      errorMessage.value = 'Le nom est obligatoire'
      loading.value = false
      return
    }

    const response = await addCategory(form.value)

    toast.success(response.message || 'Catégorie ajoutée avec succès')

    router.push('/admin/categories') 

  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || err.message || 'Erreur lors de la soumission'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <CategoryCreateForm
    :form="form"
    :loading="loading"
    :errorMessage="errorMessage"
    @submit="handleSubmit"
  />
</template>
