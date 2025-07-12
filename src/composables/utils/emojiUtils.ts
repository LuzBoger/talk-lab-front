import type { Ref } from 'vue'

export function toggleEmojiPicker(
  target: 'user' | 'interlocutor',
  currentTarget: Ref<'user' | 'interlocutor' | null>,
  showEmojiPickerUser: Ref<boolean>,
  showEmojiPickerInterlocutor: Ref<boolean>,
) {
  currentTarget.value = target
  if (target === 'user') {
    showEmojiPickerUser.value = !showEmojiPickerUser.value
    showEmojiPickerInterlocutor.value = false
  } else {
    showEmojiPickerInterlocutor.value = !showEmojiPickerInterlocutor.value
    showEmojiPickerUser.value = false
  }
}

export function emojiSelected(
  event: any,
  currentTarget: Ref<'user' | 'interlocutor' | null>,
  messageUser: Ref<string>,
  messageInterlocutor: Ref<string>,
  showEmojiPickerUser: Ref<boolean>,
  showEmojiPickerInterlocutor: Ref<boolean>,
) {
  const emoji = event.i
  if (currentTarget.value === 'user') {
    messageUser.value += emoji
    showEmojiPickerUser.value = false
  } else {
    messageInterlocutor.value += emoji
    showEmojiPickerInterlocutor.value = false
  }
  currentTarget.value = null
}
