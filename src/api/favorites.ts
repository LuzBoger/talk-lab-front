import { apiClient } from "../utils/apiClient";

export const addFavorite = async (conversationId : number) => {
    return await apiClient.post(`/favorites/add/${conversationId}`);
}

export const getFavorites = async () => {
    const response =  await apiClient.get(`/favorites`);
    return response.data;
}

export const removeFavorite = async (conversationId: number) => {
    return await apiClient.delete(`/favorites/remove/${conversationId}`);
}