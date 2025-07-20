<script setup lang="ts"></script>
<template>
  <section class="w-full bg-gray-50 py-20">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="text-center md:text-left">
        <h1 class="text-2xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">
          Créez des fausses conversations avc TalkLabs
        </h1>
        <p class="text-lg text-gray-600 mb-8">
            Imaginez des conversations, personnalisez-les, et partagez-les en un instant.
        </p>
        <router-link
          to="/create-conversation"
          class="inline-block bg-purple-600 text-white font-medium px-6 py-3 rounded-full hover:bg-purple-700 transition"
        >
          Commencer maintenant
        </router-link>
      </div>
      <div class="hidden md:block">
        <img src="" alt="Illustration" class="w-full max-w-md mx-auto" />
      </div>
    </div>
  </section>
</template>