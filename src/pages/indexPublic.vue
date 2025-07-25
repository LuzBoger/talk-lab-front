<script setup lang="ts">
import AboutTalkLabs from '../components/home/AboutTalkLabs.vue'
import Comments from '../components/home/Comments.vue'
import Conversation from '../components/home/Conversation.vue'
import FeaturesSection from '../components/home/FeaturesSection.vue'
import HeroSection from '../components/home/HeroSection.vue'
import LogoIcon from '../components/icon/LogoIcon.vue'
</script>

<template>
  <div class="min-h-screen">
    <header>
      <div class="flex items-center gap-8 pt-8 pl-8">
        <LogoIcon />
        <span class="text-main-color font-semibold text-2xl">TalkLab</span>
      </div>
    </header>

    <HeroSection />
    <AboutTalkLabs />
    <FeaturesSection />
    <Conversation />
    <Comments />
  </div>
</template>
