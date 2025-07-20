<script setup lang="ts">
import BatterieFullIcon from './previewIcon/batterie/BatterieFullIcon.vue'
import BatterieGoodIcon from './previewIcon/batterie/BatterieGoodIcon.vue'
import BatterieMidIcon from './previewIcon/batterie/BatterieMidIcon.vue'
import BatterieLowIcon from './previewIcon/batterie/BatterieLowIcon.vue'
import SignalGoodIcon from './previewIcon/signal/SignalGoodIcon.vue'
import SignalMidIcon from './previewIcon/signal/SignalMidIcon.vue'
const props = defineProps({
  Hour: String,
  signalSelected: String,
  networks: String,
  batSelected: String,
})
</script>
<template>
  <div class="pl-[22px] pt-4 pr-4 flex justify-between text-black">
    <span class="text-sm">{{ props.Hour }}</span>
    <div class="flex gap-1">
      <div class="flex items-center">
        <SignalGoodIcon v-if="props.signalSelected == 'Bien'" />
        <SignalMidIcon v-if="props.signalSelected == 'Moyen'" />
      </div>
      <span class="text-sm text-black">{{ props.networks }}</span>
      <div class="flex items-center">
        <BatterieFullIcon v-if="props.batSelected == 'full'" />
        <BatterieGoodIcon v-if="props.batSelected == 'green'" />
        <BatterieMidIcon v-if="props.batSelected == 'yellow'" />
        <BatterieLowIcon v-if="props.batSelected == 'red'" />
      </div>
    </div>
  </div>
</template>
