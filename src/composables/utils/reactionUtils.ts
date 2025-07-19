import type { Ref } from 'vue'

export function addReaction(
  index: number,
  emoji: string,
  messages: Ref<any>,
  setFieldValue: Function,
) {
  const updatedMessages = [...messages.value]
  updatedMessages[index].reaction = emoji
  messages.value = updatedMessages
  setFieldValue('content.messages', updatedMessages)
}
