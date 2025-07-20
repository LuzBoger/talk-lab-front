<script setup lang="ts">

import {ref, computed} from 'vue';
import { useNotificationsStore } from '../stores/useNotificationsStore';
import Pagination from './ui/Pagination.vue';

const notifications = useNotificationsStore();
const currentPage = ref(1);
const pageSize = 10;

const paginated = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    return notifications.sortedNotifications.slice(start, start + pageSize);
});

const formatedDate = (date: string) => {
    return new Date(date).toLocaleString()
}

</script>

<template>
   <div class="flex justify-between mb-4 space-x-2">
                <button
                 type="button"
                 @click="notifications.markAllRead"
                 class="w-1/3 flex-1 px-4 py-2 bg-blue-600 text-white rounded"
                >
                 Marquer toutes comme lues
                </button>
                <button
                   type="button"
                   @click="notifications.toggleSort"
                   class="w-auto px-4 py-2 bg-gray-200 rounded"
                >
                Trier par date {{ notifications.sortDesc ? '&#8595;' : '&#8593;'  }}
                </button>

                <button
                 type="button"
                 @click="notifications.deleteNotifications"
                 class="w-1/3 px-4 py-2 bg-red-600 text-white rounded"
                >
                 Supprimer toutes les notifications
                </button>
        </div>

        <ul class="space-y-4" v-if="notifications.sortedNotifications.length > 0" >
            <li
             v-for="notification in paginated"
             :key="notification.id"
             class="rounded-lg shadow p-4 flex justify-between items-start border-l-4 "
             :class="notification.isRead ? 'border-gray-300' : 'border-blue-500'"
             >
                <div>
                   <p class="text-sm font-semibold text-white">{{ notification.message }}</p>
                    <p class=" text-xs text-gray-500 mt-1">{{ formatedDate(notification.createdAt) }}</p>
                </div>

                <div class="flex gap-2">
                    <button
                     v-if="!notification.isRead"
                     type="button"
                     @click="notifications.markRead(notification.id)"
                     class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                     >
                     Lue
                    </button>
                     <button
                     type="button"
                     @click="notifications.deleteOneNotification(notification.id)"
                     class="text-xs px-2 py-1 bg-red-100 text-green-700 rounded"
                     >
                     Supprimer
                </button>
                </div>
        </li>
        </ul>

    <p v-if="notifications.notifications.length === 0" class="text-center text-white mt-6">Aucune notification</p>

    <Pagination
      v-model="currentPage"
      :totalItems="notifications.sortedNotifications.length"
      :pageSize="pageSize"
      @update:modelValue="pagesize => currentPage = pagesize"
    />

</template>