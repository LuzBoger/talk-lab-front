<template>
  <button
    @click="action"
    class="flex gap-2 bg-none border-none text-text-primary p-2.5 text-left w-full rounded-lg text-sm cursor-pointer transition-colors duration-200 hover:bg-dropdown-hover"
  >
    <slot name="icon"></slot>
    <span> {{ label }} </span>
  </button>
</template>

<script>
export default {
  name: 'DropdownButton',
  props: {
    label: {
      type: String,
      required: true,
    },
    action: {
      type: Function,
      required: true,
    },
  },
}
</script>
