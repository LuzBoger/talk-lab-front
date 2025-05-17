import { apiClient } from "../utils/apiClient";
import type { Conversation } from "../types/Conversation";

export const createConversation = async (conversation:Conversation) => {
    const response = await apiClient.post('/conversation', conversation);
    return response.data;
}
export const getConversations = async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/conversations');
    return response.data;
}

export const getConversationById = async (id: number): Promise<Conversation> => {
    const response = await apiClient.get(`/conversation/${id}`);
    return response.data;
}

export const updateConversation = async (id: number, conversation: Conversation): Promise<Conversation> => {
    const response = await apiClient.put(`/update/conversation/${id}`, conversation);      
    return response.data;
}

export const deleteConversation = async (id: number): Promise<void> => {
    await apiClient.delete(`/delete/conversation/${id}`);
}

export const publishedConversation = async (id: number, updateConversation : any): Promise<void> => {
    await apiClient.put(`/publish/conversation/${id}`, updateConversation); 
}
export const resetConversation = async (id: number,) => {
    const response = await apiClient.put(`/reset/conversation/${id}`);
    console.log(response.data);
    return response.data;
}