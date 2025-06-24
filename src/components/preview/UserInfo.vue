<script setup lang="ts">
defineProps({
  urlArrowLeft: String,
  selectedFile: String,
  user: Object,
})
</script>
<template>
  <div class="flex">
    <div class="min-h-9 flex items-center">
      <img :src="urlArrowLeft" alt="Arrow left" width="10px" height="18px" />
    </div>
    <div class="flex pl-4">
      <img
        v-if="selectedFile"
        :src="selectedFile"
        alt="Selected Image"
        class="rounded-full max-h-[35px] w-[35px]"
      />
    </div>
    <div class="flex flex-col pl-[5px] relative">
      <span class="text-base absolute top-[-2px] inline whitespace-nowrap">
        {{ user.name }}
      </span>
      <span
        class="text-xs text-pseudo absolute bottom-[2px] inline whitespace-nowrap"
      >
        {{ user.pseudo }}
      </span>
    </div>
  </div>
</template>
