import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import type { Ref } from 'vue'
import { toast } from 'vue3-toastify'

export async function startVocal(
  target: 'user' | 'interlocutor',
  recorder: Ref<any>,
  isRecordingUser: Ref<boolean>,
  isRecordingInterlocutor: Ref<boolean>,
) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    recorder.value = new RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/wav',
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
      desiredSampRate: 16000,
    })
    recorder.value.startRecording()
    if (target === 'user') {
      isRecordingUser.value = true
      isRecordingInterlocutor.value = false
    } else {
      isRecordingInterlocutor.value = true
      isRecordingUser.value = false
    }
    recorder.value._stream = stream
  } catch (error) {
    toast.error('Erreur lors du vocal')
  }
}

export async function stopVocal(
  target: 'user' | 'interlocutor',
  recorder: Ref<any>,
  isRecordingUser: Ref<boolean>,
  isRecordingInterlocutor: Ref<boolean>,
  sendMessage: Function,
) {
  if (!recorder.value) return
  recorder.value.stopRecording(async () => {
    const audioBlob = recorder.value.getBlob()
    if (recorder.value._stream) {
      recorder.value._stream
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop())
    }
    if (target === 'user') {
      isRecordingUser.value = false
    } else {
      isRecordingInterlocutor.value = false
    }
    await sendMessage(target, '', { audio: audioBlob })
    recorder.value = null
  })
}
