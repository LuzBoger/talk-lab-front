import { apiClient } from '../utils/apiClient'
import type { Conversation } from '../types/Conversation'
import type { Likers } from '../types/Likers'
import type { array } from 'yup'

export const createConversation = async (conversation: Conversation) => {
  const response = await apiClient.post('/create-conversation', conversation)
  return response.data
}

export const getPublicConversations = async (): Promise<Conversation[]> => {
  const response = await apiClient.get('/get-conversations-public')
  console.log('Conversation Publique', response)
  return response.data
}

export const getConversationById = async (
  id: number,
): Promise<Conversation> => {
  const response = await apiClient.get(`/get-conversation/${id}`)
  return response.data
}

export const getConversationsByUser = async (): Promise<Conversation[]> => {
  const response = await apiClient.get('/get-conversations-by-user')
  return response.data
}

export const updateConversation = async (
  id: number,
  conversation: Conversation,
): Promise<Conversation> => {
  const response = await apiClient.put(
    `/update-conversation/${id}`,
    conversation,
  )
  return response.data
}

export const deleteConversation = async (id: number): Promise<void> => {
  const response = await apiClient.delete(`/delete-conversation/${id}`)
  return response.data
}

export const uploadMedia = async (media: { image?: Blob; audio?: Blob }) => {
  const formData = new FormData()

  if (media.image) {
    formData.append('image', media.image)
  }

  if (media.audio) {
    formData.append('audio', media.audio)
  }

  const response = await apiClient.post('/messages/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  console.log(response.data)
  return response
}

export const getPublicConversationByCategory = async (
  categoryId: number,
): Promise<Conversation[]> => {
  const response = await apiClient.get(`/get-conversations-by-category/${categoryId}`)
  return response.data
}


export const searchPublicConversations = async (title: string , categoryNames: string[], page:number, limit:number): Promise<{ conversations: Conversation[], total: number}> => {
       const response = await apiClient.get(`/public-conversations`, {
        params: {title, category: categoryNames, page, limit}
    })

    const data = JSON.parse(response.data.content)
    return {

      conversations: data.conversations ?? [],
      total: data.total ?? 0

    }
}

export const getLikesCount = async (conversationId: number): Promise<number> => {
  const response = await apiClient.get(`/conversation/${conversationId}/likes`)
  return response.data
}

export const getLikers = async (conversationId: number): Promise<Likers[]> => {
  const response = await apiClient.get(`/conversation/${conversationId}/likers`)
  return response.data
}

export const addLike = async (conversationId: number): Promise<void> => {
  const response = await apiClient.post(`/conversation/like`, {conversationId} )
  return response.data
}

export const removeLike = async (conversationId: number): Promise<void> => {
  const response = await apiClient.post(`/conversation/remove-like`, {conversationId })
  return response.data
}
export const getMostLikedPublicConversation = async (): Promise<Conversation[]> => {
  const response = await apiClient.get('/most-liked-conversation')
  return response.data
}



