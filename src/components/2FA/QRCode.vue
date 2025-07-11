<script setup lang="ts">
import QRCodeVue3 from "qrcode-vue3"

const props = defineProps<{otpAuthUrl: string}>()

</script>


<template>
    <div v-if="props.otpAuthUrl">
        <QRCodeVue3 :value="props.otpAuthUrl" :width="200" :height="200"  />
    </div>
</template>