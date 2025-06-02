import { apiClient } from "../utils/apiClient";
import type { Conversation } from "../types/Conversation";

export const createConversation = async (conversation:Conversation) => {
    const response = await apiClient.post('/conversation', conversation);
    return response.data;
}


export const getPublicConversations = async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/conversations/public');
    console.log("Conversation Publique", response)
    return response.data;

}

export const getConversationById = async (id: number): Promise<Conversation> => {
    const response = await apiClient.get(`/conversation/${id}`);
    return response.data;
}

export const getConversationsByUser = async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/conversations');
    return response.data
}

export const updateConversation = async (id: number, conversation: Conversation): Promise<Conversation> => {
    const response = await apiClient.put(`/update/conversation/${id}`, conversation);      
    return response.data;
}

export const deleteConversation = async (id: number): Promise<void> => {
    await apiClient.delete(`/delete/conversation/${id}`);
}

export const uploadMedia = async (media: {image?: Blob; audio?: Blob}) => {
    const formData = new FormData();

    if(media.image) {
        formData.append('image', media.image);
    }

    if(media.audio) {
        formData.append('audio', media.audio)
    }

    const response = await apiClient.post('/messages/upload', formData, {
        headers: {
            'Content-Type' : 'multipart/form-data'
        },
    });
    console.log(response.data)
    return response;
}

