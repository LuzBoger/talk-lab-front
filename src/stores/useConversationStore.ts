import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Conversation } from '../types/Conversation'
import {
  getPublicConversations,
  getConversationById,
  getConversationsByUser,
  createConversation,
  updateConversation,
  deleteConversation,
  uploadMedia,
  getPublicConversationByCategory,
} from '../api/conversation'

export const useConversationStore = defineStore('conversation', () => {
  const publicConversations = ref<Conversation[]>([])
  const userConversations = ref<Conversation[]>([])
  const currentConversation = ref<Conversation | null>(null)
  const categoryConversations = ref<Conversation[]>([])

  const fetchPublicConversations = async () => {
    publicConversations.value = await getPublicConversations()
  }

  const fetchConversationById = async (id: number) => {
    currentConversation.value = await getConversationById(id)
  }

  const fetchConversationsByUser = async () => {
    userConversations.value = await getConversationsByUser()
  }

  const fetchConversationsByCategory = async (categoryId: number) => {
    categoryConversations.value =
      await getPublicConversationByCategory(categoryId)
  }

  const addConversation = async (conversation: Conversation) => {
    const newConv = await createConversation(conversation)
    userConversations.value.push(newConv)
  }

  const updateConversationById = async (
    id: number,
    conversation: Conversation,
  ) => {
    const updated = await updateConversation(id, conversation)
    currentConversation.value = updated
  }

  const removeConversation = async (id: number) => {
    await deleteConversation(id)
    userConversations.value = userConversations.value.filter(
      (conv) => conv.id !== id,
    )
  }

  const uploadConversationMedia = async (media: {
    image?: Blob
    audio?: Blob
  }) => {
    return await uploadMedia(media)
  }


  return {
    publicConversations,
    userConversations,
    currentConversation,
    categoryConversations,
    fetchPublicConversations,
    fetchConversationById,
    fetchConversationsByUser,
    fetchConversationsByCategory,
    addConversation,
    updateConversationById,
    removeConversation,
    uploadConversationMedia,
  }
  
})
