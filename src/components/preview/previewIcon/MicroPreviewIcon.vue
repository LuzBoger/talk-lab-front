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
})
</script>
<template>
  <svg
    :width="props.width"
    :height="props.height"
    :fill="'none'"
    stroke="#000000"
    viewBox="0 0 16 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.5 8.80391V9.61121C14.5 11.4014 13.7888 13.1183 12.523 14.3842C11.2571 15.65 9.54021 16.3612 7.75 16.3612C5.95979 16.3612 4.2429 15.65 2.97703 14.3842C1.71116 13.1183 1 11.4014 1 9.61121V8.80391"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M7.75 16.3612V19" stroke-width="2" stroke-linejoin="round" />
    <path
      d="M4.7854 19H10.5436"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.7499 13.3705C6.79512 13.3705 5.87945 12.9912 5.20432 12.3161C4.52919 11.641 4.1499 10.7253 4.1499 9.7705V4.6C4.1499 3.64522 4.52919 2.72955 5.20432 2.05442C5.87945 1.37928 6.79512 1 7.7499 1C8.70468 1 9.62036 1.37928 10.2955 2.05442C10.9706 2.72955 11.3499 3.64522 11.3499 4.6V9.7705C11.3499 10.7253 10.9706 11.641 10.2955 12.3161C9.62036 12.9912 8.70468 13.3705 7.7499 13.3705Z"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
