<script setup lang="ts">
import AboutTalkLabs from '../components/Home/AboutTalkLabs.vue';
import Comments from '../components/Home/Comments.vue';
import Conversation from '../components/Home/Conversation.vue';
import FeaturesSection from '../components/Home/FeaturesSection.vue';
import HeroSection from '../components/Home/HeroSection.vue';
import LogoIcon from '../components/icon/LogoIcon.vue';
</script>

<template>
  <div class="min-h-screen">
    <header>
      <div class="max-md:w-20 max-md:pt-4 max-md:pl-4 md:w-24 md:pt-6 md:pl-6">
        <LogoIcon />
      </div>
    </header>
    
    <HeroSection />
    <AboutTalkLabs />
    <FeaturesSection />
    <Conversation />
    <Comments />
  </div>
</template>