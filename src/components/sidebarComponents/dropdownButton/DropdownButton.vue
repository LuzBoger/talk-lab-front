<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="props.to"
    class="flex gap-2 bg-none border-none text-text-primary p-2.5 text-left w-full rounded-lg text-sm cursor-pointer transition-colors duration-200 hover:bg-dropdown-hover"
  >
    <slot name="icon"></slot>
    <span> {{ props.label }} </span>
  </RouterLink>
</template>
