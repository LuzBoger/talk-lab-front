import { defineStore } from "pinia";
import { ref } from "vue";
import type { Conversation } from "../types/Conversation";
import { getPublicConversations } from "../api/conversation";

export const useConversationStore = defineStore('conversation', () => {
    const conversations = ref<Conversation[]>([])
    const publicConversations = ref<Conversation[]>([])

    const fetchPublicConversations = async () => {
        const response = await getPublicConversations()
        publicConversations.value = response
    }
    




    return {publicConversations,fetchPublicConversations}
})