<script setup lang="ts">
import AboutTalkLabs from '../components/Home/AboutTalkLabs.vue'
import Comments from '../components/Home/Comments.vue'
import Conversation from '../components/Home/Conversation.vue'
import FeaturesSection from '../components/Home/FeaturesSection.vue'
import HeroSection from '../components/Home/HeroSection.vue'
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
