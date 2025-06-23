<script setup lang="ts">
const props = defineProps<{
  width: number
  height: number
  fillColor: string
}>()
</script>
<template>
  <svg
    :width="props.width"
    :height="props.height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
      :fill="props.fillColor"
    />
  </svg>
</template>
