import { ref } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
import { updateUserProfile } from '../api/userProfile'

export function useUserProfile() {
  const authStore = useAuthStore()

  const form = ref({
    username: '',
    email: '',
    name: '',
    avatarUrl: '',
  })

  const avatarFile = ref<File | null>(null)
  const error = ref<string>('')

  const loadUserProfile = async () => {
    await authStore.loadUser()
    const user = authStore.user

    if (user) {
      form.value.username = user.username || ''
      form.value.email = user.email || ''
      form.value.name = user.name || ''
      form.value.avatarUrl = user.avatarUrl || ''
    } else {
      console.error('Aucun utilisateur connecté')
      error.value = 'Aucun utilisateur connecté'
    }
  }

  const updateProfilAvatar = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null
    if (file) {
      avatarFile.value = file
    }
  }

  const submit = async () => {
    try {
      const formData = new FormData()
      formData.append('username', form.value.username)
      formData.append('email', form.value.email)

      if (avatarFile.value) {
        formData.append('avatar', avatarFile.value)
      }

      const response = await updateUserProfile(formData)
      error.value = ''

      const updatedUser = response.updatedUser
      if (updatedUser) {
        authStore.user = updatedUser

        form.value.username = updatedUser.username || ''
        form.value.email = updatedUser.email || ''
        form.value.name = updatedUser.name || ''
        form.value.avatarUrl = updatedUser.avatarUrl || ''

        avatarFile.value = null
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err)
      error.value = 'Une erreur est survenue lors de la mise à jour du profil.'
    }
  }

  return {
    form,
    avatarFile,
    error,
    loadUserProfile,
    updateProfilAvatar,
    submit,
  }
}
