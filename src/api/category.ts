import type { Category } from "../types/Category";
import { apiClient } from "../utils/apiClient";




export const getCategories = async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;

}


