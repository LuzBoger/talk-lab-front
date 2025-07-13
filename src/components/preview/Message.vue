<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Reaction from '../Reaction.vue'
import clsx from 'clsx'
import type { Messages } from '../../types/Messages'
import Vocal from './Vocal.vue'

const props = defineProps({
  message: {
    type: Object as () => Messages,
    required: true,
  },
  color: String,
  radiusClass: {
    type: Object as () => {
      borderTopLeftRadius?: string
      borderTopRightRadius?: string
      borderBottomLeftRadius?: string
      borderBottomRightRadius?: string
    },
    required: false,
  },
  index: Number,
  addReaction: {
    type: Function,
    required: true,
  },
})

const showReaction = ref<boolean>(false)
const showPlusButton = ref<boolean>(false)
const imageUrl = ref<string | null>(null)

const handleMouseOver = () => {
  if (props.addReaction !== undefined) showPlusButton.value = true
}
const handleMouseLeave = () => {
  if (props.addReaction !== undefined) showPlusButton.value = false
}
const toggleReaction = () => {
  if (props.addReaction === undefined) return
  showReaction.value = !showReaction.value
}

const handleReactionSelected = (emoji: string) => {
  if (props.addReaction === undefined) return
  props.addReaction(props.index, emoji)
  showReaction.value = false
  showPlusButton.value = false
}

onMounted(() => {
  if (props.message?.image) {
    if (typeof props.message.image === 'string') {
      imageUrl.value = props.message.image
    } else {
      imageUrl.value = URL.createObjectURL(props.message.image)
    }
  }
})

onBeforeUnmount(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})
console.log('props.radiusClass:', props.radiusClass)
</script>
<template>
  <div
    :style="props.radiusClass"
    :class="
      clsx(
        'max-w-[256px] px-[13.5px] py-[9px] w-fit my-[1px] leading-4.5 text-base flex items-center relative',
        addReaction !== undefined && 'cursor-pointer',
        props.message?.image ? '' : props.color,
        props.message.reaction !== '' && 'mb-5',
      )
    "
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <span>{{ props.message.message }}</span>
    <img
      v-if="imageUrl"
      :src="imageUrl"
      alt="Image from Blob"
      class="rounded-[18px]"
    />
    <span
      v-if="props.message.reaction !== ''"
      :class="
        clsx(
          'absolute left-0 rounded-full px-1.5 py-0.5 border-2 border-white',
          props.color,
          props.message?.image ? 'bottom-[-8px]' : 'bottom-[-22px]',
        )
      "
    >
      {{ props.message.reaction }}
    </span>
    <Vocal
      v-if="props.message.audio"
      :audio="props.message.audio"
      :author="props.message.author"
    />
    <button
      v-if="showPlusButton"
      @click.stop="toggleReaction"
      :class="[
        'absolute left-0 rounded-full px-3 py-0.5 border-2 bg-white border-white text-green-700 cursor-pointer bottom-[-22px] z-50',
      ]"
    >
      +
    </button>
    <Reaction
      v-if="showReaction"
      :author="props.message.author"
      @selected="(emoji) => handleReactionSelected(emoji)"
    />
  </div>
</template>
