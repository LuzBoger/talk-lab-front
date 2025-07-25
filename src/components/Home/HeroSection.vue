<script setup lang="ts">
</script>
<template>
  <section class="w-full py-20">
    <div
      class="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
    >
      <div class="text-center">
        <h1
          class="text-2xl md:text-4xl font-bold text-white leading-tight mb-6"
        >
          Créez des fausses conversations avec TalkLab
        </h1>
        <p class="text-lg text-gray-200 mb-8">
          Imaginez des conversations, personnalisez-les, et partagez-les en un
          instant.
        </p>
        <router-link
          to="/create-conversation"
          class="inline-block bg-main-color hover:bg-main-color-hover text-black font-medium px-6 py-3 rounded-full transition"
        >
          Commencer maintenant
        </router-link>
      </div>
      <div class="hidden md:flex justify-center">
        <img
          src="../../assets/images/presentation.webp"
          alt="exemple de conversation"
          class="w-60 max-w-md mx-auto"
          loading="lazy"
        />
      </div>
    </div>
  </section>
</template>
