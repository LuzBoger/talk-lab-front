<script setup lang="ts">
const props = defineProps({
  message: String,
  color: String,
  radiusClass: String,

})
</script>
<template>
  <div
    :class="[
      'max-w-[256px] px-[13.5px] py-[9px] w-fit my-[1px] leading-4.5 text-base rounded-[18px]',
      props.radiusClass,
      props.color,
    ]"
  >
    <span>{{ props.message }}</span>
  </div>
</template>
