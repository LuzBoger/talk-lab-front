<script setup lang="ts">
import type { Conversation } from '../../types/Conversation'
import PreviewHeader from './PreviewHeader.vue'
import UserInfo from './UserInfo.vue'
import MessageContainer from './MessageContainer.vue'
import BottomBar from './BottomBar.vue'
import html2canvas from 'html2canvas'
import { onBeforeUnmount, watch, ref } from 'vue'
const props = defineProps<{
  conversation: Conversation
  canBeModified: boolean
}>()
const previewRef = ref<HTMLElement | null>(null)
const vocalAudioRef = ref<HTMLAudioElement | null>(null)
const captureDiv = async () => {
  if (!previewRef.value) return
  try {
    previewRef.value.scrollIntoView({ behavior: 'auto', block: 'center' })
    await document.fonts.ready
    const canvas = await html2canvas(previewRef.value, {
      scale: 3.3333,
      useCORS: true,
      scrollY: -window.scrollY,
      backgroundColor: '#fff',
    })
    const imgURL = canvas.toDataURL('image/png')
    const downloadLink = document.createElement('a')
    downloadLink.href = imgURL
    downloadLink.download = 'div_capture.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (error) {
    console.error('Erreur lors de la conversion avec html2canvas:', error)
  }
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isRecording = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordedChunks = ref<Blob[]>([])
let animationFrameId: number | null = null

// Audio context et nodes
let audioCtx: AudioContext | null = null
let destination: MediaStreamAudioDestinationNode | null = null
let audioSource: MediaElementAudioSourceNode | null = null

const startRecording = async () => {
  if (!canvasRef.value || !previewRef.value) return

  // Taille du canvas = taille de la div à capturer
  const previewRect = previewRef.value.getBoundingClientRect()
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  canvas.width = Math.round(previewRect.width)
  canvas.height = Math.round(previewRect.height)

  // 1. Capture vidéo du canvas
  const videoStream = canvas.captureStream(15) // 15 FPS

  // 2. Capture audio du site via Web Audio API
  // Suppose que tu as une balise <audio id="site-audio">
  const audioElement = vocalAudioRef.value
  let combinedStream: MediaStream
  if (audioElement) {
    audioCtx = new (window.AudioContext || window.AudioContext)()

    destination = audioCtx.createMediaStreamDestination()
    audioSource = audioCtx.createMediaElementSource(audioElement)
    audioSource.connect(destination)
    audioSource.connect(audioCtx.destination) // Pour entendre le son aussi

    // 3. Combine vidéo + audio
    combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...destination.stream.getAudioTracks(),
    ])
  } else {
    // Si pas d'audio, vidéo seule
    combinedStream = videoStream
  }

  // 4. Enregistre
  recordedChunks.value = []
  mediaRecorder.value = new MediaRecorder(combinedStream)
  mediaRecorder.value.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunks.value.push(e.data)
  }
  mediaRecorder.value.onstop = () => {
    const blob = new Blob(recordedChunks.value, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'preview.webm'
    a.click()
    URL.revokeObjectURL(url)
  }
  mediaRecorder.value.start()
  isRecording.value = true

  // Boucle de rendu : copie la div dans le canvas à chaque frame
  const renderLoop = async () => {
    if (!ctx || !previewRef.value) return
    const imgCanvas = await html2canvas(previewRef.value, {
      backgroundColor: '#fff',
      scale: 3.3333,
      useCORS: true,
      width: canvas.width,
      height: canvas.height,
    })
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imgCanvas, 0, 0, canvas.width, canvas.height)
    if (isRecording.value) {
      animationFrameId = requestAnimationFrame(renderLoop)
    }
  }
  renderLoop()
}

const stopRecording = () => {
  isRecording.value = false
  mediaRecorder.value?.stop()
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  // Ferme l'audio context proprement
  if (audioCtx && audioCtx.state !== 'closed') {
    audioCtx.close()
  }
}

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (audioCtx && audioCtx.state !== 'closed') {
    audioCtx.close()
  }
})
watch(vocalAudioRef, (val) => {
  console.log('vocalAudioRef changed:', val)
  if (val) console.log('audio element:', val)
})

function handlePlayVocal(audioEl: HTMLAudioElement) {
  vocalAudioRef.value = audioEl
}
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <!-- Preview principale -->
    <div class="w-fit flex flex-col gap-4">
      <div
        ref="previewRef"
        class="w-preview h-preview flex flex-col justify-between bg-white font-sans-sf"
      >
        <!-- ...le reste de ton contenu... -->
        <div>
          <PreviewHeader
            :Hour="props.conversation.content.startTime"
            :signalSelected="props.conversation.content.signal"
            :networks="props.conversation.content.reseau"
            :batSelected="props.conversation.content.batteryLevel"
          />
          <UserInfo
            :interlocutorName="props.conversation.content.interlocutor_name"
            :interlocutorUsername="
              props.conversation.content.interlocutor_username
            "
            :interlocutorAvatar="
              props.conversation.content.interlocutor_avatar ?? undefined
            "
          />
          <MessageContainer
            :messages="
              (props.conversation.content.messages ?? []).map((msg) => ({
                ...msg,
                time: msg.time ?? undefined,
                reaction: msg.reaction ?? undefined,
              }))
            "
            :interlocutorAvatar="
              props.conversation.content.interlocutor_avatar ?? undefined
            "
            @play-vocal="handlePlayVocal"
          />
        </div>
        <div class="flex flex-col items-center">
          <BottomBar />
          <div
            class="min-w-32 max-w-32 min-h-[5px] mb-1.5 rounded-full bg-black"
          ></div>
        </div>
      </div>
      <button
        @click="captureDiv"
        class="w-full px-4 py-2 bg-validate-button hover:bg-validate-button-hover cursor-pointer text-white rounded font-semibold"
      >
        Prendre un screenshot
      </button>
      <!-- Canvas caché pour la capture vidéo -->
      <canvas ref="canvasRef" style="display: none"></canvas>
      <button
        v-if="!isRecording"
        @click="startRecording"
        class="w-full mb-2 px-4 py-2 bg-validate-button hover:bg-validate-button-hover cursor-pointer text-white rounded font-semibold"
      >
        BETA Démarrer l'enregistrement vidéo (no audio)
      </button>
      <button
        v-else
        @click="stopRecording"
        class="w-full mb-2 px-4 py-2 bg-cancel-color hover:bg-cancel-hover cursor-pointer text-white rounded font-semibold"
      >
        Arrêter et télécharger l'enregistrement
      </button>
    </div>
    <div
      class="w-[350px] h-fit bg-card-bg rounded-lg shadow-md p-6 flex flex-col gap-4"
    >
      <h2 class="text-xl font-bold mb-2 text-white">
        Titre : {{ props.conversation.title }}
      </h2>
      <p class="text-gray-100 mb-2">
        Description : {{ props.conversation.description }}
      </p>
      <div
        v-if="
          props.conversation.categoriesId &&
          props.conversation.categoriesId.length
        "
      >
        <h3 class="font-semibold mb-2 text-white">Catégories :</h3>
        <ul class="flex gap-2">
          <li
            v-for="cat in props.conversation.categoriesId"
            :key="cat.id"
            class="text-sm text-white"
          >
            {{ cat.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
