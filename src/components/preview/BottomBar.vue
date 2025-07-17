<script setup lang="ts">
import CameraIcon from '../icon/CameraIcon.vue'
import AddPreviewIcon from './previewIcon/AddPreviewIcon.vue'
import GaleryPreviewIcon from './previewIcon/GaleryPreviewIcon.vue'
import MicroPreviewIcon from './previewIcon/MicroPreviewIcon.vue'
</script>
<template>
  <div class="flex flex-col items-center max-w-preview">
    <div
      class="min-h-10 w-[337px] rounded-full mx-2 mb-6.5 border border-write-white"
    >
      <div class="flex items-center h-full justify-between">
        <!-- Logo photo + message -->
        <div class="flex">
          <div
            class="min-h-[30px] min-w-[30px] max-w-[30px] bg-takephoto rounded-full ml-[5px] flex justify-center items-center"
          >
            <CameraIcon />
          </div>
          <span class="text-sm ml-2 flex items-center text-[#6b6b6b]">
            Votre message...
          </span>
        </div>
        <!-- Icônes -->
        <div class="flex gap-4 items-center mr-5">
          <MicroPreviewIcon :width="13.5" :height="18" />
          <GaleryPreviewIcon :width="20" :height="20" :fill-color="'#000000'" />
          <AddPreviewIcon :width="18" :height="18" />
        </div>
      </div>
    </div>
  </div>
</template>
