<script setup lang="ts">
import type { PropType } from 'vue'
import type { Messages } from '../../types/Messages'
import Message from './Message.vue'

const props = defineProps({
  messages: {
    type: Array as PropType<Messages[]>,
    required: true,
  },
  interlocutorAvatar: String,
})

const isLastInterlocutorMessage = (index: number, currentAuthor: string) => {
  return (
    currentAuthor === 'interlocutor' &&
    (index === props.messages.length - 1 ||
      props.messages[index + 1].author !== 'interlocutor')
  )
}

const addMarginClass = (index: number, currentAuthor: string) => {
  return index < props.messages.length - 1 &&
    currentAuthor !== props.messages[index + 1].author
    ? 'mb-3'
    : ''
}

const choiceColor = (author: string) => {
  if (author === 'user') {
    return 'bg-mess-you text-white mr-4'
  } else {
    return 'bg-[#efefef] text-black'
  }
}
const getMessageRadiusClass = (index: number, currentAuthor: string) => {
  const isFirstMessage = index === 0
  const isLastMessage = index === props.messages.length - 1
  const previousMessageSameAuthor =
    !isFirstMessage && currentAuthor === props.messages[index - 1].author
  const nextMessageSameAuthor =
    !isLastMessage && currentAuthor === props.messages[index + 1].author

  if (previousMessageSameAuthor && nextMessageSameAuthor) {
    // Si le message précédent et suivant sont du même auteur, on réduit les rayons des coins supérieur et inférieur
    return currentAuthor === 'user'
      ? 'rounded-tr-[2px] rounded-br-[2px] rounded-l-[18px]'
      : 'rounded-tl-[2px] rounded-bl-[2px] rounded-r-[18px]'
  } else if (previousMessageSameAuthor) {
    // Si seulement le message précédent est du même auteur, on réduit le rayon du coin supérieur
    return currentAuthor === 'user'
      ? 'rounded-tr-[2px] rounded-l-[18px] rounded-br-[18px]'
      : 'rounded-tl-[2px] rounded-r-[18px] rounded-bl-[18px]'
  } else if (nextMessageSameAuthor) {
    // Si seulement le message suivant est du même auteur, on réduit le rayon du coin inférieur
    return currentAuthor === 'user'
      ? 'rounded-br-[2px] rounded-l-[18px] rounded-tr-[18px]'
      : 'rounded-bl-[2px] rounded-r-[18px] rounded-tl-[18px]'
  } else {
    // Sinon, on applique un rayon complet à tous les coins
    return 'rounded-[18px]'
  }
}
</script>
<template>
  <div class="mt-2 flex flex-col">
    <div
      v-for="(message, index) in messages"
      :key="'message_' + index"
      :class="[
        'flex',
        message.author === 'user' ? 'place-self-end' : '',
        addMarginClass(index, message.author),
      ]"
    >
      <div
        v-if="
          isLastInterlocutorMessage(index, message.author) && interlocutorAvatar
        "
        class="min-w-[46px] relative"
      >
        <img
          :src="interlocutorAvatar"
          alt="Interlocutor Avatar"
          class="rounded-full h-[25px] w-[25px] absolute bottom-0 right-3"
        />
      </div>
      <div v-else>
        <!-- Espaceur si nécessaire -->
        <div class="min-w-[46px]"></div>
      </div>
      <Message
        :message="message.message"
        :color="choiceColor(message.author)"
        :radiusClass="getMessageRadiusClass(index, message.author)"
      />
    </div>
  </div>
</template>
