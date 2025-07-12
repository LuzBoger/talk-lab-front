<script setup lang="ts">
import type { Conversation } from '../../types/Conversation'
import PreviewHeader from './PreviewHeader.vue'
import UserInfo from './UserInfo.vue'
import MessageContainer from './MessageContainer.vue'
import BottomBar from './BottomBar.vue'
const props = defineProps<{ conversation: Conversation, canBeModified: boolean }>()
console.log('ConversationPreview props:', props)
console.log(props.conversation.content.startTime)
</script>

<template>
  <div>
    <div
      class="w-preview h-preview flex flex-col justify-between font-sans bg-white"
    >
      <div>
        <PreviewHeader
          :Hour="props.conversation.content.startTime"
          :signalSelected="props.conversation.content.signal"
          :networks="props.conversation.content.reseau"
          :batSelected="props.conversation.content.batteryLevel"
        />
        <UserInfo
          :interlocutorName="props.conversation.content.interlocutor_name"
          :interlocutorUsername="
            props.conversation.content.interlocutor_username
          "
          :interlocutorAvatar="props.conversation.content.interlocutor_avatar"
        />
        <MessageContainer
          :messages="props.conversation.content.messages"
          :interlocutorAvatar="props.conversation.content.interlocutor_avatar"
          :addReaction="undefined"
        />
      </div>
      <div class="flex flex-col items-center">
        <BottomBar />
        <div
          class="min-w-32 max-w-32 min-h-[5px] mb-1.5 rounded-full bg-black"
        ></div>
      </div>
    </div>
  </div>
</template>
