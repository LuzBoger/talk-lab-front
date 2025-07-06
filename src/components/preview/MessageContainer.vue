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
  addReaction: {
    type: Function,
    required: true,
  },
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
  const currentMessageHasReaction = props.messages[index].reaction !== ''
  const previousMessageSameAuthor =
    !isFirstMessage && currentAuthor === props.messages[index - 1].author
  const nextMessageSameAuthor =
    !isLastMessage && currentAuthor === props.messages[index + 1].author
  const previousMessageHasReaction =
    !isFirstMessage && props.messages[index - 1].reaction !== ''

  // Fonction auxiliaire pour déterminer les classes de rayon en fonction des conditions
  const getRadiusClasses = (
    topRadius: string,
    bottomRadius: string,
    leftRadius: string,
    rightRadius: string,
  ) => {
    return `rounded-t${topRadius} rounded-b${bottomRadius} rounded-l${leftRadius} rounded-r${rightRadius}`
  }

  // Gérer le cas où le message actuel a une réaction et aucun message précédent du même auteur
  if (currentMessageHasReaction && !previousMessageSameAuthor) {
    return getRadiusClasses('[18px]', '[18px]', '[18px]', '[18px]')
  }

  // Gérer le cas où les messages précédent et suivant sont du même auteur
  if (previousMessageSameAuthor && nextMessageSameAuthor) {
    if (currentMessageHasReaction) {
      return currentAuthor === 'user'
        ? getRadiusClasses('r-[2px]', 'r-[18px]', '[18px]', '[18px]')
        : getRadiusClasses('l-[2px]', 'l-[18px]', '[18px]', '[18px]')
    } else {
      if (previousMessageHasReaction) {
        return currentAuthor === 'user'
          ? getRadiusClasses('r-[18px]', 'r-[2px]', '[18px]', '[18px]')
          : getRadiusClasses('l-[18px]', 'l-[2px]', '[18px]', '[18px]')
      }
      return currentAuthor === 'user'
        ? getRadiusClasses('r-[2px]', 'r-[2px]', '[18px]', '[18px]')
        : getRadiusClasses('l-[2px]', 'l-[2px]', '[18px]', '[18px]')
    }
  }

  // Gérer le cas où seul le message précédent est du même auteur
  if (previousMessageSameAuthor) {
    if (previousMessageHasReaction) {
      return currentAuthor === 'user'
        ? getRadiusClasses('[18px]', 'r-[18px]', '[18px]', '[2px]')
        : getRadiusClasses('[18px]', 'l-[18px]', '[2px]', '[18px]')
    } else {
      return currentAuthor === 'user'
        ? getRadiusClasses('r-[2px]', 'r-[18px]', '[18px]', '[18px]')
        : getRadiusClasses('l-[2px]', 'l-[18px]', '[18px]', '[18px]')
    }
  }

  // Gérer le cas où seul le message suivant est du même auteur
  if (nextMessageSameAuthor) {
    return currentAuthor === 'user'
      ? getRadiusClasses('r-[18px]', 'r-[2px]', '[18px]', '[18px]')
      : getRadiusClasses('l-[18px]', 'l-[2px]', '[18px]', '[18px]')
  }

  // Cas par défaut
  return getRadiusClasses('[18px]', '[18px]', '[18px]', '[18px]')
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
        :message="message"
        :color="choiceColor(message.author)"
        :radiusClass="getMessageRadiusClass(index, message.author)"
        :index="index"
        :addReaction="addReaction"
      />
    </div>
  </div>
</template>
