import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Messages } from '../types/Messages'
import { uploadMedia } from '../api/conversation'
const baseUrl = import.meta.env.VITE_BASE_URL

export function useMessages(
  message: Ref<Messages[]>,
  setFieldValue: (field: any, value: any) => void,
) {
  const messages = ref<Messages[]>(message.value || [])

  watch(
    () => message.value,
    (newMessages) => {
      if (newMessages) {
        messages.value = newMessages
      }
    },
  )

  const sendMessage = async (
    author: 'user' | 'interlocutor',
    messageContent: string,
    otherContent?: {
      image?: Blob
      audio?: Blob
    },
  ) => {
    let urls: { image?: string; audio?: string } = {}

    if (otherContent && (otherContent.image || otherContent.audio)) {
      try {
        const res = await uploadMedia(otherContent)
        if (res.data.imageUrl) urls.image = baseUrl + res.data.imageUrl
        if (res.data.audioUrl) urls.audio = baseUrl + res.data.audioUrl
      } catch (error) {
        console.error("Erreur lors de l'upload", error)
      }
    }

    const newMessage: Messages = {
      author,
      message: messageContent,
      isSeen: false,
      reaction: '',
      ...urls,
    }

    if (author === 'interlocutor') {
      for (let i = messages.value.length - 1; i >= 0; i--) {
        if (messages.value[i].author === 'user') {
          messages.value[i].isSeen = true
          break
        }
      }
    }

    messages.value = [...messages.value, newMessage]
    setFieldValue('content.messages', messages.value)
  }

  return {
    messages,
    sendMessage,
  }
}
