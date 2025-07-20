<script setup lang="ts">
import ArrowLeftIcon from '../icon/ArrowLeftIcon.vue'
import CallIcon from '../icon/CallIcon.vue'
import VideoCallIcon from '../icon/VideoCallIcon.vue'

const props = defineProps({
  interlocutorName: String,
  interlocutorUsername: String,
  interlocutorAvatar: String,
})
console.log(props)
</script>
<template>
  <div
    class="pl-[22px] flex pt-5 justify-between border-b pb-1 border-write-white text-black"
  >
    <div class="flex">
      <div class="min-h-9 flex items-center">
        <ArrowLeftIcon />
      </div>
      <div class="flex pl-4">
        <img
          v-if="interlocutorAvatar"
          :src="interlocutorAvatar"
          alt="Interlocuteur avatar"
          loading="lazy"
          class="rounded-full max-h-[35px] w-[35px]"
        />
      </div>
      <div class="flex flex-col pl-[5px] relative">
        <span class="text-base absolute top-[-2px] inline whitespace-nowrap">
          {{ props.interlocutorName }}
        </span>
        <span
          class="text-xs text-pseudo absolute bottom-[2px] inline whitespace-nowrap"
        >
          {{ props.interlocutorUsername }}
        </span>
      </div>
    </div>
    <div class="flex pr-4 gap-6 items-center">
      <CallIcon />
      <VideoCallIcon />
    </div>
  </div>
</template>
