import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { conversationSchema } from '../validation/conversationSchema'
import type { Messages } from '../types/Messages'
import { getConversationById } from '../api/conversation'
import { useMessages } from './useMessages'
import { useConversation } from './useConversation'
import { useCategoryStore } from '../stores/useCategoryStore'
import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import { toast } from 'vue3-toastify'
import { uploadMedia } from '../api/conversation'

export function useConversationSimulator(props: { conversationId?: number }) {
  const route = useRoute()
  const router = useRouter()
  const conversationId = ref<number | null>(
    props.conversationId ?? parseInt(route.params.id as string),
  )
  const messageUser = ref<string>('')
  const messageInterlocutor = ref<string>('')
  const showEmojiPickerUser = ref<boolean>(false)
  const currentTarget = ref<'user' | 'interlocutor' | null>(null)
  const showEmojiPickerInterlocutor = ref<boolean>(false)
  const showPublishModal = ref<boolean>(false)
  const showSaveModal = ref<boolean>(false)
  const isDropdownOpen = ref<boolean>(false)
  const isConversationModified = ref<boolean>(false)
  const initialvalues = ref(null)
  const imageUserSend = ref<string | undefined>(undefined)
  const imageInterlocutorSend = ref<string | undefined>(undefined)
  const imageUserSelected = ref<File | null>(null)
  const imageInterlocutorSelected = ref<File | null>(null)
  const imgInputUser = ref<HTMLInputElement | null>(null)
  const imgInputInterlocutor = ref<HTMLInputElement | null>(null)
  const isRecordingUser = ref<boolean>(false)
  const isRecordingInterlocutor = ref<boolean>(false)
  const recorder = ref<any>(null)
  let nextRoute: any = null
  const showCategoryModal = ref<boolean>(false)
  const categoryStore = useCategoryStore()
  const selectedCategories = ref<number[]>([])
const baseUrl= import.meta.env.VITE_BASE_URL;

  const { handleSubmit, errors, setFieldValue, values, submitCount } = useForm({
    validationSchema: toTypedSchema(conversationSchema),
    initialValues: {
      title: '',
      description: '',
      categoriesId: [],
      status: 'draft',
      isPublic: false,
      content: {
        interlocutor_name: '',
        interlocutor_username: '',
        interlocutor_avatar: '',
        startTime: '',
        batteryLevel: 'full',
        reseau: '',
        signal: 'Bien',
        messages: [],
      },
    },
  })
  const { value: title } = useField<string>('title')
  const { value: description } = useField<string>('description')
  const { value: categoriesId } = useField<number[]>('categoriesId')
  const { value: startTime } = useField<string>('content.startTime')
  const { value: batteryLevel } = useField<string>('content.batteryLevel')
  const optionsBat = ['full', 'green', 'yellow', 'red']
  const { value: reseau } = useField<string>('content.reseau')
  const { value: signal } = useField<string>('content.signal')
  const optionsSignal = ['Bien', 'Moyen']
  const { value: interlocutor_name } = useField<string>(
    'content.interlocutor_name',
  )
  const { value: interlocutor_username } = useField<string>(
    'content.interlocutor_username',
  )
  const { value: interlocutor_avatar } = useField<string>(
    'content.interlocutor_avatar',
  )
  const { value: messagesUsers } = useField<Messages[]>('content.messages')
  // Crée un watcher pour observer les changements de la variable errors
  watch(
    errors,
    (newErrors) => {
      console.log('Nouvelles erreurs:', newErrors)
    },
    { deep: true },
  ) // Utilisez deep: true pour observer les changements imbriqués dans l'objet

  watch(
    values,
    (newValues) => {
      console.log('Nouvelles values :', newValues)
    },
    { deep: true },
  ) // Utilisez deep: true pour observer les changements imbriqués dans l'objet

  const { messages, sendMessage } = useMessages(messagesUsers, setFieldValue)
  const {
    status,
    isPublic,
    createFakeConversation,
    saveConversationChanges,
    publishConversationToPublic,
    deleteFakeConversation,
  } = useConversation(conversationId, values, setFieldValue)

  const sendUserMessage = async () => {
    if (!messageUser.value && !imageUserSelected.value) return
    if (imageUserSelected.value && messageUser.value) {
      await sendMessage('user', messageUser.value, {
        image: imageUserSelected.value,
      })
    } else if (imageUserSelected.value) {
      await sendMessage('user', '', { image: imageUserSelected.value })
    } else {
      await sendMessage('user', messageUser.value)
    }
    messageUser.value = ''
    imageUserSend.value = ''
    imageUserSelected.value = null
  }

  const sendInterlocutorMessage = async () => {
    if (!messageInterlocutor.value && !imageInterlocutorSelected.value) return
    if (imageInterlocutorSelected.value && messageInterlocutor.value) {
      await sendMessage('interlocutor', messageInterlocutor.value, {
        image: imageInterlocutorSelected.value,
      })
    } else if (imageInterlocutorSelected.value) {
      await sendMessage('interlocutor', '', {
        image: imageInterlocutorSelected.value,
      })
    } else {
      await sendMessage('interlocutor', messageInterlocutor.value)
    }
    messageInterlocutor.value = ''
    imageInterlocutorSend.value = ''
    imageInterlocutorSelected.value = null
  }

  const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    console.log(file)
    if (file) {
      imageInterlocutorSelected.value = file
      try {
        // Upload le fichier et récupère l'URL du backend
        const response = await uploadMedia({ image: file as Blob })
        console.log(response.data)
        setFieldValue('content.interlocutor_avatar', baseUrl + response.data.imageUrl)
        imageInterlocutorSend.value = response.data.imageUrl
      } catch (error) {
        toast.error("Erreur lors de l'upload de l'image")
      }
    }
  }
  const onSubmit = handleSubmit(async (formValues) => {
    try {
      const res = await createFakeConversation(formValues)
      toast.success(res.message)
      router.push('/profil/mes-conversations')
    } catch (error: any) {
      toast.error('Erreur lors de la création de la conversation')
    }
  })

  const saveChanges = async () => {
    try {
      await saveConversationChanges()
      toast.success('Changements sauvegardés avec succès')
      isConversationModified.value = false
      showSaveModal.value = false
      if (nextRoute) {
        await router.push(nextRoute)
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des modifications')
    }
  }

  const cancelSave = () => {
    showSaveModal.value = false
  }

  const publishConversation = async () => {
    if (!conversationId.value) {
      toast.error("La conversation n'existe pas")
      return
    }
    try {
      await publishConversationToPublic()
      toast.success('Conversation publiée avec succès')
      showPublishModal.value = false
      isConversationModified.value = false
    } catch (error) {
      toast.error('Erreur lors de la publication de la conversation')
    }
  }

  const cancelPublish = () => {
    showPublishModal.value = false
  }

  const deleteConversaiton = async () => {
    if (!conversationId.value) {
      toast.error("La conversation n'existe pas")
      return
    }
    try {
      await deleteFakeConversation()
      router.push('/profil/mes-conversations')
    } catch (error) {
      toast.error('Erreur lors de la suppression de la conversation')
    }
  }

  const addReaction = (index: number, emoji: string) => {
    const updatedMessages = [...messages.value]
    updatedMessages[index].reaction = emoji
    messages.value = updatedMessages
    setFieldValue('content.messages', updatedMessages as any)
  }

  const toggleEmojiPicker = (target: 'user' | 'interlocutor') => {
    currentTarget.value = target
    if (target === 'user') {
      showEmojiPickerUser.value = !showEmojiPickerUser.value
      showEmojiPickerInterlocutor.value = false
    } else {
      showEmojiPickerInterlocutor.value = !showEmojiPickerInterlocutor.value
      showEmojiPickerUser.value = false
    }
  }

  const emojiSelected = (event: any) => {
    const emoji = event.i
    if (currentTarget.value === 'user') {
      messageUser.value += emoji
      showEmojiPickerUser.value = false
    } else {
      messageInterlocutor.value += emoji
      showEmojiPickerInterlocutor.value = false
    }
    currentTarget.value = null
  }

  const onImageClickedByUser = () => {
    imgInputUser.value?.click()
  }
  const onImageClickedByInterlocutor = () => {
    imgInputInterlocutor.value?.click()
  }

  const imageSelected = (event: Event, target: 'user' | 'interlocutor') => {
    const input = event.target as HTMLInputElement
    if (input.files) {
      const file = input.files[0]
      const reader = new FileReader()
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('Le fichier dépasse la taille maximale de 2Mo')
        return
      }
      reader.onload = () => {
        const imgPreview = reader.result as string
        if (target === 'user') {
          imageUserSend.value = imgPreview
          imageUserSelected.value = file
        } else {
          imageInterlocutorSend.value = imgPreview
          imageInterlocutorSelected.value = file
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (target: 'user' | 'interlocutor') => {
    if (target === 'user') {
      imageUserSend.value = ''
      imageUserSelected.value = null
    } else {
      imageInterlocutorSend.value = ''
      imageInterlocutorSelected.value = null
    }
  }

  const startVocal = async (target: 'user' | 'interlocutor') => {
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

  const stopVocal = async (target: 'user' | 'interlocutor') => {
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

  const onAudioClicked = (target: 'user' | 'interlocutor') => {
    if (target === 'user') {
      if (isRecordingUser.value) {
        stopVocal('user')
      } else {
        startVocal('user')
      }
    } else {
      if (isRecordingInterlocutor.value) {
        stopVocal('interlocutor')
      } else {
        startVocal('interlocutor')
      }
    }
  }

  const openSaveModal = () => {
    showSaveModal.value = true
    isDropdownOpen.value = false
  }

  const openPublishModal = () => {
    showPublishModal.value = true
    isDropdownOpen.value = false
  }

  const handleCreateConversation = async (categories: number[]) => {
    selectedCategories.value = [...categories]
    await setFieldValue('categoriesId', [...categories])
    showCategoryModal.value = false
  }

  onBeforeRouteLeave((to, from, next) => {
    if (isConversationModified.value) {
      nextRoute = to
      showSaveModal.value = true
      next(false)
    } else {
      next()
    }
  })

  watch(
    values,
    (newVal) => {
      if (!initialvalues.value) {
        return
      }
      const isModified =
        JSON.stringify(newVal) !== JSON.stringify(initialvalues.value)
      isConversationModified.value = isModified
    },
    { deep: true },
  )

  onMounted(async () => {
    if (conversationId.value) {
      try {
        const response = await getConversationById(conversationId.value)
        setFieldValue('title', response.title)
        setFieldValue('description', response.description)
        setFieldValue('content', response.content)
        setFieldValue('categoriesId', response.categoriesId)
        status.value = response.status
        isPublic.value = response.isPublic
        initialvalues.value = JSON.parse(JSON.stringify(values))
        isConversationModified.value = false
      } catch (error) {
        toast.error('Erreur lors de la récupération de la conversation')
      }
    }
  })

  return {
    // Champs du formulaire
    title,
    description,
    categoriesId,
    startTime,
    batteryLevel,
    optionsBat,
    reseau,
    signal,
    optionsSignal,
    interlocutor_name,
    interlocutor_username,
    interlocutor_avatar,
    messagesUsers,
    conversationId,
    // UI
    messageUser,
    messageInterlocutor,
    showEmojiPickerUser,
    showEmojiPickerInterlocutor,
    showPublishModal,
    showSaveModal,
    isDropdownOpen,
    isConversationModified,
    imageUserSend,
    imageInterlocutorSend,
    imageUserSelected,
    imageInterlocutorSelected,
    imgInputUser,
    imgInputInterlocutor,
    isRecordingUser,
    isRecordingInterlocutor,
    showCategoryModal,
    selectedCategories,
    errors,
    submitCount,
    status,
    isPublic,
    messages,
    categoryStore,
    // Actions
    sendUserMessage,
    sendInterlocutorMessage,
    handleFileUpload,
    onSubmit,
    saveChanges,
    cancelSave,
    publishConversation,
    cancelPublish,
    deleteConversaiton,
    addReaction,
    toggleEmojiPicker,
    emojiSelected,
    onImageClickedByUser,
    onImageClickedByInterlocutor,
    imageSelected,
    removeImage,
    onAudioClicked,
    openSaveModal,
    openPublishModal,
    handleCreateConversation,
  }
}