<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserProfile } from '../composables/useUserProfile'
import defaultProfileImg from '../assets/images/defaultAvatar.png'

const { form, avatarFile, loadUserProfile, updateProfilAvatar, submit } =
  useUserProfile()

const baseUrl = import.meta.env.VITE_BASE_URL
const url = ref<string | null>(null)

const profileAvatar = computed(() => {
  if (avatarFile.value) {
    if (url.value) {
      URL.revokeObjectURL(url.value)
    }
    url.value = URL.createObjectURL(avatarFile.value)
    return url.value
  } else if (form.value.avatarUrl) {
    return `${baseUrl}${form.value.avatarUrl}`
  } else {
    return defaultProfileImg
  }
})

const updateProfile = async () => {
  await submit()
}

onMounted(() => {
  loadUserProfile()
})
</script>

<template>
  <div class="text-white flex flex-col items-center">
    <div class="relative">
      <img
        :src="profileAvatar"
        alt="Profile"
        class="w-32 h-32 rounded-full object-cover border-4 border-[#1E1E2F]"
      />
      <label
        for="image-upload"
        class="absolute bottom-0 right-0 bg-[#1A192C] p-2 rounded-full cursor-pointer hover:bg-[#2C2C3F]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z"
            fill="#E3E3E3"
          />
        </svg>
      </label>
      <input
        id="image-upload"
        type="file"
        class="hidden"
        @change="updateProfilAvatar"
        accept="image/*"
      />
    </div>

    <div class="w-full max-w-sm mt-8 space-y-4">
      <div class="flex flex-col">
        <label for="name" class="text-sm font-medium">Nom Prénom</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="mt-1 p-2 bg-[#1E1E2F] rounded border border-[#2C2C3F] focus:outline-none focus:ring-2 focus:ring-[#3A3A4F]"
          disabled
        />
      </div>

      <div class="flex flex-col">
        <label for="name" class="text-sm font-medium">Username</label>
        <input
          v-model="form.username"
          type="text"
          id="username"
          class="mt-1 p-2 bg-[#1E1E2F] rounded border border-[#2C2C3F] focus:outline-none focus:ring-2 focus:ring-[#3A3A4F]"
        />
      </div>

      <div class="flex flex-col">
        <label for="email" class="text-sm font-medium">Email</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="mt-1 p-2 bg-[#1E1E2F] rounded border border-[#2C2C3F] focus:outline-none focus:ring-2 focus:ring-[#3A3A4F]"
        />
      </div>

      <button
        @click="updateProfile"
        class="w-full bg-[#3A3A4F] hover:bg-[#4A4A5F] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-[#5A5A6F]"
      >
        Mettre à jour
      </button>
    </div>
  </div>
</template>
