import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Messages } from '../types/Messages'

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
    console.log(otherContent)
    // Supposons que vous ayez un Blob audio

    const newMessage: Messages = {
      author,
      message: messageContent,
      isSeen: false,
      reaction: '',
      image: otherContent?.image,
      audio: otherContent?.audio,
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
