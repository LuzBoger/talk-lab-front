<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import clsx from 'clsx'

const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  activePath: {
    type: String,
    required: true,
  },
  svgIcon: {
    type: String,
    required: false,
  },
  className: {
    type: String,
    required: false,
    default: '',
  },
})

const route = useRoute()

const isActive = computed(() => {
  if (props.activePath === '/' || props.activePath === '/admin') {
    return route.path === props.activePath
  }
  return (
    route.path === props.activePath || route.path.startsWith(props.activePath)
  )
})
</script>

<template>
  <div
    :class="
      clsx(
        'flex',
        'items-center',
        'p-[10px_16px]',
        'rounded-[8px]',
        'cursor-pointer',
        'select-none',
        'transition-colors',
        'duration-200',
        'ease-in-out',
        'mb-[8px]',
        'hover:bg-[#2E2B55]',
        {
          'bg-[#444071]': isActive,
        },
        props.className,
      )
    "
  >
    <RouterLink
      :to="props.to"
      class="flex items-center md:gap-[12px] text-inherit no-underline w-full h-full"
    >
      <slot name="icon"></slot>
      <span
        class="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-[16px] max-md:hidden"
      >
        <slot></slot>
      </span>
    </RouterLink>
  </div>
</template>
