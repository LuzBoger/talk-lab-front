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
    required: false,
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

  const currentMessageHasAudio = props.messages[index].audio !== undefined

  // Vérifier si le message précédent ou suivant contient une image
  const hasImageBefore =
    !isFirstMessage && props.messages[index - 1].image !== undefined
  const hasImageAfter =
    !isLastMessage && props.messages[index + 1].image !== undefined

  // Fonction auxiliaire pour déterminer les classes de rayon en fonction des conditions
  const getRadiusClasses = (
    topLeftRadius: string,
    topRightRadius: string,
    bottomLeftRadius: string,
    bottomRightRadius: string,
  ) => {
    const clean = function (v: string) {
      return v.replace(/[\[\]]/g, '') || '18px'
    }
    return {
      borderTopLeftRadius: clean(topLeftRadius),
      borderTopRightRadius: clean(topRightRadius),
      borderBottomLeftRadius: clean(bottomLeftRadius),
      borderBottomRightRadius: clean(bottomRightRadius),
    }
  }

  // Gérer le cas où le message actuel a une réaction et aucun message précédent du même auteur
  if (currentMessageHasReaction && !previousMessageSameAuthor) {
    return getRadiusClasses('18px', '18px', '18px', '18px')
  }
  // Gérer le cas où il y a une image avant ou après le message actuel
  if (hasImageBefore || hasImageAfter) {
    return getRadiusClasses('18px', '18px', '18px', '18px')
  }

  // Gérer le cas où le message actuel est un audio
  if (currentMessageHasAudio) {
    if (currentMessageHasReaction && !previousMessageSameAuthor) {
      return getRadiusClasses('18px', '18px', '18px', '18px')
    }
    if (previousMessageSameAuthor && nextMessageSameAuthor) {
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '2px', '18px', '2px')
        : getRadiusClasses('2px', '18px', '2px', '18px')
    }
    if (previousMessageSameAuthor) {
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '2px', '18px', '18px')
        : getRadiusClasses('2px', '18px', '18px', '18px')
    }
    if (nextMessageSameAuthor) {
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '18px', '18px', '2px')
        : getRadiusClasses('18px', '18px', '2px', '18px')
    }
    return getRadiusClasses('18px', '18px', '18px', '18px')
  }

  // Gérer le cas où les messages précédent et suivant sont du même auteur
  if (previousMessageSameAuthor && nextMessageSameAuthor) {
    if (currentMessageHasReaction) {
      if (previousMessageHasReaction) {
        return currentAuthor === 'user'
          ? getRadiusClasses('18px', '18px', '18px', '18px')
          : getRadiusClasses('18px', '18px', '18px', '18px')
      }
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '2px', '18px', '18px')
        : getRadiusClasses('2px', '18px', '18px', '18px')
    } else {
      if (previousMessageHasReaction) {
        return currentAuthor === 'user'
          ? getRadiusClasses('18px', '18px', '18px', '2px')
          : getRadiusClasses('18px', '18px', '2px', '18px')
      }
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '2px', '18px', '2px')
        : getRadiusClasses('2px', '18px', '2px', '18px')
    }
  }

  // Gérer le cas où seul le message précédent est du même auteur
  if (previousMessageSameAuthor) {
    if (previousMessageHasReaction) {
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '18px', '18px', '18px')
        : getRadiusClasses('18px', '18px', '18px', '18px')
    } else {
      return currentAuthor === 'user'
        ? getRadiusClasses('18px', '2px', '18px', '18px')
        : getRadiusClasses('2px', '18px', '18px', '18px')
    }
  }

  // Gérer le cas où seul le message suivant est du même auteur
  if (nextMessageSameAuthor) {
    console.log('Case: nextMessageSameAuthor')
    return currentAuthor === 'user'
      ? getRadiusClasses('18px', '18px', '18px', '2px')
      : getRadiusClasses('18px', '18px', '2px', '18px')
  }

  // Cas par défaut
  console.log('Case: default')
  return getRadiusClasses('18px', '18px', '18px', '18px')
}
</script>
<template>
  <div
    class="mt-2 flex flex-col h-message-preview custom-scrollbar overflow-y-auto"
  >
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
