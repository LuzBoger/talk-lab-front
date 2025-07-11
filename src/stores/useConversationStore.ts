import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Conversation } from '../types/Conversation'
import { getPublicConversations } from '../api/conversation'

export const useConversationStore = defineStore('conversation', () => {
  const publicConversations = ref<Conversation[]>([])

  const fetchPublicConversations = async () => {
    const response = await getPublicConversations()
    console.log('the honored test')
    console.log(response)
    publicConversations.value = response
  }

  return { publicConversations, fetchPublicConversations }
})
