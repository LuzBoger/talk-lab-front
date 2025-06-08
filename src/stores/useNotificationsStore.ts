import { defineStore } from "pinia";
import {ref, computed} from 'vue';
import type  { Notification } from "../types/Notification";
import {getNotifications, markNotificationAsRead,  markAllNotificationAsRead, deleteNotification,deleteAllNotifications} from '../api/notification';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';



export const useNotificationsStore = defineStore('notifications', () => {

    const notifications = ref<Notification[]>([])
    const sortDesc = ref<Boolean>(true)

    
    const countUnReadNotifications = computed(() => {
        return notifications.value.filter(n => !n.isRead).length
    })


    const loadAllNotifications = async () => {
        try {
            notifications.value = await getNotifications()
            console.log('Notifications récupérées avec succès', notifications.value)

        } catch(error) {
            console.error('Erreur lors de la récupéeration des notifications', error)
        }
    }

    const markRead = async (idNotification: number) => {
        try {
            await markNotificationAsRead(idNotification)
            const notification = notifications.value.find(n => n.id === idNotification)
            if(notification) {
                notification.isRead = true
            }
            toast.success('Notification marquée comme lue')
        } catch(error) {
            console.error('Erreur lors du changement d\'état de la notification', error)
            toast.error('Erreur lors du changement d\'état de la notification')
        }

    }

    const markAllRead = async () => {
        try {
            await markAllNotificationAsRead()
            notifications.value.forEach(n => (n.isRead = true))
            toast.success('Toutes les notifications ont été marquées comme lues')
        } catch(error) {
            console.error('Erreur lors du changement d\'état de la notification', error)
            toast.error('Erreur lors du changement d\'état de la notification')
        }

    }

    const deleteOneNotification = async (idNotification: number) => {
        try {
            await deleteNotification(idNotification)
            notifications.value = notifications.value.filter(n => n.id !== idNotification)
            toast.success('Notification supprimée avec succès')
        } catch(error) {
            console.error('Erreur lors de la suppression de la notification', error)
            toast.error('Erreur lors de la suppression de la notification')
        }
    }

    const deleteNotifications = async () => {

        try {
            await deleteAllNotifications()
            notifications.value = []
            toast.success('Toutes les notifications ont été supprimées avec succès')
        } catch(error) {
            console.error('Erreur lors de la suppression des notifications', error)
            toast.error('Erreur lors de la suppression des notifications')
        }
    }

    const toggleSort = () => {
        sortDesc.value = !sortDesc.value
    }

    const sortedNotifications = computed(() => {
        return [...notifications.value].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return sortDesc.value ? dateB - dateA : dateA - dateB
        })
    })


    return {
        notifications,
        sortDesc,
        countUnReadNotifications,
        loadAllNotifications,
        markRead,
        markAllRead,
        deleteOneNotification,
        deleteNotifications,
        toggleSort,
        sortedNotifications
    }
})