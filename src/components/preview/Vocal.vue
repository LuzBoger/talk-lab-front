<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, type Ref } from 'vue'
import clsx from 'clsx'
import PlayPreviewIcon from './previewIcon/PlayPreviewIcon.vue'
const props = defineProps({
  audio: String,
  author: String,
})
const isPlaying = ref(false)
const audioPlayer = ref<HTMLAudioElement | null>(null)
const emit = defineEmits(['play-vocal'])
const duration = ref<number | null>(null)
const audioUrl = ref('')
const remaining = ref<number | null>(null)
const currentProgress = ref<number>(0)
let intervalId: number | null = null
const playbackStarted = ref(false)

// Ajout pour la waveform
const waveform = ref<number[]>([])

const generateWaveform = async (blob: Blob) => {
  const arrayBuffer = await blob.arrayBuffer()
  const audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
  const channelData = audioBuffer.getChannelData(0)
  const durationSec = audioBuffer.duration

  // Calcule dynamiquement le nombre de traits
  let samples = 10
  if (durationSec >= 10) {
    samples = 20
  } else if (durationSec > 3) {
    samples = Math.round(10 + ((durationSec - 3) / 7) * 20)
  }
  const step = Math.floor(channelData.length / samples)
  const amplitudes = []
  for (let i = 0; i < samples; i++) {
    const start = i * step
    const end = start + step
    let sum = 0
    for (let j = start; j < end; j++) {
      sum += Math.abs(channelData[j] || 0)
    }
    amplitudes.push(sum / step)
  }
  // Trouve l'amplitude max pour normaliser
  const max = Math.max(...amplitudes) || 1
  // Normalise chaque valeur entre 10 et 40px
  waveform.value = amplitudes.map((a) =>
    Math.max(10, Math.round((a / max) * 40)),
  )
}
const startCountdown = () => {
  if (duration.value === null) return
  remaining.value = duration.value
  if (intervalId) clearInterval(intervalId)

  intervalId = setInterval(() => {
    if (audioPlayer.value && !audioPlayer.value.paused) {
      remaining.value = Math.max(
        0,
        audioPlayer.value.duration - audioPlayer.value.currentTime,
      )
      currentProgress.value = audioPlayer.value.currentTime
      if (remaining.value === 0) {
        clearInterval(intervalId!)
        intervalId = null
      }
    }
  }, 200)
}

const togglePlay = () => {
  console.log('Audio player:', audioPlayer.value)
  if (audioPlayer.value) {
    emit('play-vocal', audioPlayer.value)
  }
  if (isPlaying.value) {
    audioPlayer.value?.pause()
    stopCountdown()
  } else {
    audioPlayer.value?.play()
    startCountdown()
    playbackStarted.value = true // Marquer que la lecture a commencé
  }
  isPlaying.value = !isPlaying.value
}

const stopCountdown = () => {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
  remaining.value = duration.value
  playbackStarted.value = false // Réinitialiser l'état de la lecture
}

const onEnded = () => {
  isPlaying.value = false
  stopCountdown()
}

const onLoadedMetadata = () => {
  if (audioPlayer.value) {
    console.log(audioPlayer.value)
    duration.value = audioPlayer.value.duration
    remaining.value = duration.value
  }
}

watch(duration, (newVal, oldVal) => {
  console.log('Duration changed from', oldVal, 'to', newVal)
})

onMounted(async () => {
  let blob: Blob
  audioUrl.value = props.audio ?? ''
  try {
    if (typeof props.audio === 'string' && props.audio) {
      const response = await fetch(props.audio)
      if (!response.ok) {
        throw new Error('Impossible de récupérer le fichier audio')
      }
      blob = await response.blob()
      await generateWaveform(blob)
    } else {
      throw new Error("L'URL audio est invalide ou non définie")
    }
  } catch (error) {
    console.error("Erreur lors du chargement de l'audio:", error)
  }
})

onBeforeUnmount(() => {
  URL.revokeObjectURL(audioUrl.value)
  stopCountdown()
})

console.log('Audio URL:', audioUrl.value)

const formatDuration = (d: number | null) => {
  if (d === null) return '--:--'
  const totalSeconds = Math.ceil(d)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
const fillColor = computed(() => {
  return props.author === 'user' ? '#FFFFFF' : '#000000'
})
console.log(props.author)
</script>
<template>
  <div class="flex flex-col justify-center rounded-lg">
    <div @click="togglePlay" class="flex items-center">
      <!-- Icône de lecture/pause -->
      <PlayPreviewIcon :width="13" :height="16" :fillColor="fillColor" />
      <!-- Visualisation de l'onde sonore -->
      <div class="flex-1 mx-4">
        <div class="flex items-center space-x-1">
          <div
            v-for="(height, index) in waveform"
            :key="index"
            class="w-[2.5px] rounded"
            :class="
              clsx({
                'bg-black opacity-30':
                  playbackStarted && duration && duration > 0
                    ? index / waveform.length > currentProgress / duration
                    : false,
                'bg-white':
                  props.author === 'user' &&
                  duration &&
                  duration > 0 &&
                  (!playbackStarted ||
                    index / waveform.length <= currentProgress / duration),
                'bg-black':
                  props.author !== 'user' &&
                  duration &&
                  duration > 0 &&
                  (!playbackStarted ||
                    index / waveform.length <= currentProgress / duration),
              })
            "
            :style="{ height: height + 'px' }"
          ></div>
        </div>
      </div>
      <!-- Temps -->
      <div
        :class="
          clsx('text-sm', props.author == 'user' ? 'text-white ' : 'text-black')
        "
      >
        <div
          :class="
            clsx(
              'text-sm',
              props.author === 'user' ? 'text-white ' : 'text-black',
            )
          "
        >
          {{ formatDuration(isPlaying ? remaining : duration) }}
        </div>
      </div>
    </div>
    <audio
      ref="audioPlayer"
      :src="audioUrl"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
    ></audio>
  </div>
</template>
