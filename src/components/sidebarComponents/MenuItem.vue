<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import clsx from 'clsx';

const props = defineProps({
  to: {
    type: String,
    required: true
  },
  activePath: {
    type: String,
    required: true
  },
  svgIcon: {
    type: String,
    required: false
  }
});

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.activePath || route.path.startsWith(props.activePath);
});
const routeActive  = computed(() => (path: string) => {
  return route.path === path || route.path.startsWith(path)
})

</script>

<template>
  <div :class="clsx(
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
      'bg-[#444071]': isActive
    }
  )">
    <RouterLink :to="props.to" class="flex items-center gap-[12px] text-inherit no-underline w-full h-full" :class="{ active: routeActive(props.to)}">
      <div v-if="props.svgIcon" v-html="props.svgIcon" class="flex-shrink-0"></div>
      <span class="whitespace-nowrap overflow-hidden text-ellipsis font-medium text-[16px]">
        <slot></slot>
      </span>
    </RouterLink>
  </div>
</template>
