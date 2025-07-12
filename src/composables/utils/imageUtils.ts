import type { Ref } from 'vue'
import { toast } from 'vue3-toastify'
import { uploadMedia } from '../../api/conversation'

export async function handleFileUpload(
  event: Event,
  setFieldValue: Function,
  baseUrl: string,
) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      const response = await uploadMedia({ image: file as Blob })
      setFieldValue(
        'content.interlocutor_avatar',
        baseUrl + response.data.imageUrl,
      )
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image")
    }
  }
}

export function removeImage(
  imageSendRef: Ref<string | undefined>,
  imageSelectedRef: Ref<File | null>,
) {
  imageSendRef.value = ''
  imageSelectedRef.value = null
}

export function imageSelected(
  event: Event,
  target: 'user' | 'interlocutor',
  imageUserSend: Ref<string | undefined>,
  imageUserSelected: Ref<File | null>,
  imageInterlocutorSend: Ref<string | undefined>,
  imageInterlocutorSelected: Ref<File | null>,
  toast: any,
) {
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
        console.log('est-ce que je passe ici ?')
        imageInterlocutorSend.value = imgPreview
        imageInterlocutorSelected.value = file
      }
    }
    reader.readAsDataURL(file)
  }
}
