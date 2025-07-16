import { apiClient } from "../utils/apiClient"
import type { Notification } from "../types/Notification"



export const getNotifications = async (): Promise<Notification[]> => {
    console.log("Fetching notifications...");
    try {
            const response = await apiClient.get('/notification')
            return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
            return [];
    }



}

export const markNotificationAsRead = async (id: number ): Promise<{ message: string}> => {
    const response = await apiClient.post(`/notification/read/${id}`)
    return response.data;
}


export const markAllNotificationAsRead = async (): Promise<{ message: string}> => {
    const response = await apiClient.post(`/notification/read-all`)
    return response.data;
}


export const deleteNotification = async (id: number ): Promise<{ message: string}> => {
    const response = await apiClient.delete(`/notification/${id}`)
    return response.data;
}


export const deleteAllNotifications = async (): Promise<{ message: string}> => {
    const response = await apiClient.delete(`/notification/delete-all`)
    return response.data;
}

