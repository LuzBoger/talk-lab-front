<script setup lang="ts">
import { ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import clsx from 'clsx'
const emit = defineEmits<{ (event: 'selected', emoji: string): void }>()
const showEmojiPicker = ref<boolean>(false)

const selectEmoji = (event: any) => {
  emit('selected', event.i)
  showEmojiPicker.value = false
}
</script>

<template>
  <div :class="clsx('relative ')">
    <div
      class="absolute top-full mt-2 left-0 z-[9999]"
      style="min-width: 250px"
    >
      <EmojiPicker @select="selectEmoji" :native="true" />
    </div>
  </div>
</template>
