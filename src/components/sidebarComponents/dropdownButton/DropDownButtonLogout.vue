<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
const emit = defineEmits(['action'])

const emitActionListener = () => {
  emit('action')
}
</script>

<template>
  <button
    @click="emitActionListener"
    class="flex gap-2 bg-none border-none text-text-primary p-2.5 text-left w-full rounded-lg text-sm cursor-pointer transition-colors duration-200 hover:bg-dropdown-hover"
  >
    <slot name="icon"></slot>
    <span> {{ props.label }} </span>
  </button>
</template>
