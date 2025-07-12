<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { ConversationListing } from '../../types/ConversationListing'
const props = defineProps<{
  conversation: ConversationListing
  isCanBeModified: boolean
}>()
const tagColors = ['yellow', 'green', 'red', 'purple']

const tags = computed(() =>
  (props.conversation?.categoriesId || []).map((cat, idx) => ({
    shortText: cat.shortName || '???',
    longText: cat.name || '???',
    color: tagColors[idx % tagColors.length],
  })),
)
// Helpers pour formater les dates (à adapter selon ton format)
function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}
</script>

<template>
  <div
    class="bg-card-bg rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg relative w-full max-w-92 mx-auto flex flex-col cursor-pointer group"
  >
    <div class="w-full">
      <img
        :src="props?.conversation?.content?.interlocutor_avatar"
        class="w-full h-full object-cover rounded-t-lg"
        style="max-height: 236px; min-height: 236px"
      />
    </div>
    <div class="p-2.5 w-full box-border mt-0 rounded-none">
      <h3 class="text-md font-semibold mb-1 text-text-primary">
        {{ props?.conversation?.title }}
      </h3>
      <div class="flex justify-between items-center">
        <div class="text-sm text-author-text">
          {{ props.conversation?.author }}
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(tag, index) in tags"
            :key="index"
            class="px-1.5 py-0.5 rounded-full text-xs font-medium border-1"
            :class="{
              'text-tag-yellow': tag.color === 'yellow',
              'text-tag-green': tag.color === 'green',
              'text-tag-red': tag.color === 'red',
              'text-tag-purple': tag.color === 'purple',
            }"
          >
            {{ tag.shortText }}
          </span>
        </div>
      </div>
    </div>
    <!-- Overlay au hover -->
    <div
      class="absolute inset-0 bg-black/80 rounded-lg flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      style="backdrop-filter: blur(2px)"
    >
      <div class="flex flex-col justify-between h-full">
        <div class="text-white px-6 py-4">
          {{ props.conversation?.description }}
        </div>
        <div class="pl-4">
          <div class="text-white">
            Dernière modification :
            <span class="">
              {{ formatDate(props.conversation?.updatedAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 m-4">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(tag, index) in tags"
            :key="'overlay-' + index"
            class="px-2 py-0.5 text-sm font-medium rounded-full border-1"
            :class="{
              'text-tag-yellow': tag.color === 'yellow',
              'text-tag-green': tag.color === 'green',
              'text-tag-red': tag.color === 'red',
              'text-tag-purple': tag.color === 'purple',
            }"
          >
            {{ tag.longText }}
          </span>
        </div>
        <router-link
          v-if="!props.isCanBeModified"
          :to="`/view-conversation/${props.conversation.id}`"
          class="px-4 py-2 bg-publish-button hover:bg-publish-button-hover cursor-pointer text-white rounded-lg shadow"
          >Visualiser</router-link
        >
        <router-link
          v-if="props.isCanBeModified"
          :to="`/edit-conversation/${props.conversation.id}`"
          class="px-4 py-2 bg-publish-button hover:bg-publish-button-hover cursor-pointer text-white rounded-lg shadow"
          >Modifier</router-link
        >
      </div>
    </div>
  </div>
</template>
