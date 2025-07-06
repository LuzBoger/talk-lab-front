<script setup lang="ts">
import { ref } from 'vue'
import Reaction from '../Reaction.vue'
import clsx from 'clsx'
const props = defineProps({
  message: Object,
  color: String,
  radiusClass: String,
  index: Number,
  addReaction: {
    type: Function,
    required: true,
  },
})
const showReaction = ref<boolean>(false)
const toggleReaction = () => {
  console.log(showReaction.value)
  showReaction.value = !showReaction.value
}
console.log(props.message)
</script>
<template>
  <div
    :class="
      clsx(
        'max-w-[256px] px-[13.5px] py-[9px] w-fit my-[1px] leading-4.5 text-base rounded-[18px] flex items-center cursor-pointer relative',
        props.radiusClass,
        props.color,
        props.message.reaction !== '' && 'mb-5'
      )
    "
    @click="toggleReaction"
  >
    <span>{{ props.message.message }}</span>
    <span
      v-if="props.message.reaction !== ''"
      :class="
        clsx(
          'absolute top-7 left-0 rounded-full px-1.5 py-0.5 border-2 border-white',
          props.color,
        )
      "
      >{{ props.message.reaction }}</span
    >

    <Reaction
      v-if="showReaction"
      @selected="(emoji) => props.addReaction(props.index, emoji)"
    />
  </div>
</template>
