<script setup lang="ts">
const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  fillColor: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <svg
    :width="props.width"
    :height="props.height"
    viewBox="0 0 21 21"
    :fill="props.fillColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10.5" cy="10.5" r="9.5" stroke-width="2" />
    <rect
      x="-0.5"
      y="0.5"
      width="1"
      height="10"
      rx="0.5"
      transform="matrix(-1 0 0 1 10.7 5)"
    />
    <rect
      x="-0.5"
      y="-0.5"
      width="1"
      height="10"
      rx="0.5"
      transform="matrix(0 -1 -1 0 15.2 10.5)"
    />
  </svg>
</template>
