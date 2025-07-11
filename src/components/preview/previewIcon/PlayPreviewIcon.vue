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
    default: '#FFFFFF',
  },
})
</script>
<template>
  <svg
    :width="props.width"
    :height="props.height"
    viewBox="0 0 39 48"
    :fill="props.fillColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 4.40453C0 1.22386 3.53263 -0.684496 6.19278 1.05914L36.7955 21.118C39.2308 22.7143 39.1989 26.2948 36.7354 27.8474L6.13277 47.1348C3.46914 48.8136 0 46.8993 0 43.7508V4.40453Z"
    />
  </svg>
</template>
