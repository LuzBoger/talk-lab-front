<script setup lang="ts">
 import {ref} from 'vue';
 import EmojiPicker from 'vue3-emoji-picker';
 import 'vue3-emoji-picker/css';


 const emit = defineEmits<{(event: 'selected', emoji: string): void}>()
 const showEmojiPicker = ref<boolean>(false)

 const togglePicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value
    console.log("change")
 }

 const selectEmoji = (event: any) => {
    emit('selected', event.i)
    showEmojiPicker.value = false
 }
</script>

<template>
    <div class="relative">
        <button type="button" class="text-xl cursor-pointer" @click="togglePicker">+</button>
        <div v-if="showEmojiPicker" class="absolute top-full mt-2 left-0 z-[9999]"  style="min-width: 250px;">
            <EmojiPicker @select="selectEmoji" :native="true" />
        </div>
    </div>
</template>