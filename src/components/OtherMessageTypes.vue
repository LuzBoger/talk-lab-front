<script setup lang="ts">

const props = defineProps<{
    isRecording?: boolean
}>()

const emit = defineEmits(['emoji', 'image', 'audio'])

const emitEmoji = () => {emit('emoji')}

const emitImage = () => {emit('image')} 

const emitVideo = () => {emit('audio')}
</script>

<template>
    <div class="flex items-center space-x-2 mt-2 text-white ">
        <button
            @click="emitEmoji"
            aria-label="Ajouter un emoji"
            type="button"
            class="flex items-center justify-center w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
        <svg
         xmlns="http://www.w3.org/2000/svg"
         height="20px"
         viewBox="0 -960 960 960"
         width="20px"
         fill="#FFFFFF"
         >
            <path d="M480-480Zm0 400q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q43 0 83 8.5t77 24.5v90q-35-20-75.5-31.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-32-6.5-62T776-600h86q9 29 13.5 58.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm320-600v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM620-520q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520Zm140 260q68 0 123.5-38.5T684-400H276q25 63 80.5 101.5T480-260Z"/>
        </svg>
        </button>

        <button
            @click="emitImage"
            aria-label="Ajouter une image"
            type="button"
            class="flex items-center justify-center w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
        <svg
         xmlns="http://www.w3.org/2000/svg"
         height="20px"
         viewBox="0 -960 960 960"
         width="20px"
         fill="#FFFFFF"
         >
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
        </svg>
        </button>


        <button
      @click="emitVideo"
      aria-label="Envoyer un vocal"
      type="button"
      :class="[
        'flex items-center justify-center w-9 h-9 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer',
        props.isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        ]"
        >
        <svg
         xmlns="http://www.w3.org/2000/svg"
         height="20px"
         viewBox="0 -960 960 960"
         width="20px"
        :fill="props.isRecording ? '#dc2626' : '#FFFFFF'"
         >
            <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/>
        </svg>
        </button>
    </div>

</template>