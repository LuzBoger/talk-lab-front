<script>
export default {
  name: 'Card',
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div
    class="bg-card-bg rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg relative w-full max-w-92 mx-auto flex flex-col cursor-pointer"
  >
    <div class="w-full">
      <img
        :src="imageUrl"
        :alt="title"
        class="w-full h-full object-cover rounded-t-lg"
      />
    </div>
    <div class="p-2.5 w-full box-border mt-0 rounded-none">
      <h3 class="text-md font-semibold mb-1 text-text-primary">
        {{ title }}
      </h3>
      <div class="flex justify-between items-center">
        <div class="text-sm text-author-text">
          {{ author }}
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
            {{ tag.text }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
