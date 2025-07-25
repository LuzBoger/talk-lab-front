<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category } from '../../../types/Category'
import CategoryEditForm from '../../../components/admin/categories/CategoryEditForm.vue'
import { editCategory, getCategoryById } from '../../../api/category'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {useHead} from '@vueuse/head';

useHead({
  title: 'Mise à jour des catégories - Admin',
  meta:[
    {name: 'robots', content: 'noindex, nofollow' },   
  ]
})
const route = useRoute()
const router = useRouter()
const categoryId = Number(route.params.id)

const form = ref<Category>({
  id: categoryId,
  name: '',
  shortName: ''
})

const loading = ref(false)
const errorMessage = ref('')

const fetchCategory = async () => {
  try {
    const existingCategory = await getCategoryById(categoryId)
    if (!existingCategory) {
      toast.error('Catégorie introuvable')
      router.push('/admin/categories')
      return
    }
    form.value = { ...existingCategory }
  } catch (err) {
    toast.error('Erreur lors du chargement de la catégorie')
    router.push('/admin/categories')
  }
}


const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    if (!form.value.name.trim()) {
      errorMessage.value = 'Le nom est obligatoire'
      loading.value = false
      return
    }

    const response = await editCategory(categoryId, form.value)
    toast.success(response.message || 'Catégorie mise à jour avec succès')
    router.push('/admin/categories')
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || err.message || 'Erreur lors de la modification'
    toast.error(errorMessage.value)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchCategory()
})

</script>

<template>
  <CategoryEditForm
    :form="form"
    :loading="loading"
    :errorMessage="errorMessage"
    @submit="handleSubmit"
  />
</template>
