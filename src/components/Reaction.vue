<script setup lang="ts">
import { ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/dist/vue3-emoji-picker.css'
import clsx from 'clsx'
const emit = defineEmits<{ (event: 'selected', emoji: string): void }>()
const showEmojiPicker = ref<boolean>(false)

const selectEmoji = (event: any) => {
  emit('selected', event.i)
  showEmojiPicker.value = false
}
const props = defineProps({
  author: String,
})
</script>

<template>
  <div :class="clsx('relative ')">
    <div
      :class="
        clsx(
          'absolute top-full mt-12 z-[9999]',
          props.author == 'user' ? 'right-5' : 'left-[-50px]',
        )
      "
      style="min-width: 250px"
    >
      <EmojiPicker @select="selectEmoji" :native="true" />
    </div>
  </div>
</template>
