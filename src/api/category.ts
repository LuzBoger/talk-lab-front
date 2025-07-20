import type { Category } from '../types/Category'
import type { CategoryResponse } from '../types/category/CategoryResponse'
import { apiClient } from '../utils/apiClient'

export const addCategory = async (
  category: Category,
): Promise<CategoryResponse> => {
  const response = await apiClient.post('/admin/add-category', category)
  return response.data
}

export const editCategory = async (
  categoryId: number,
  category: Category,
): Promise<CategoryResponse> => {
  const response = await apiClient.put(
    `/admin/edit-category/${categoryId}`,
    category,
  )
  return response.data
}

export const deleteCategory = async (categoryId: number): Promise<void> => {
  await apiClient.delete(`/admin/delete-category/${categoryId}`)
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get('/categories')
  return response.data
}
export const getCategoryById = async (
  categoryId: number,
): Promise<Category> => {
  const response = await apiClient.get(`/category/${categoryId}`)
  return response.data
}
