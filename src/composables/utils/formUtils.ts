import type { Ref } from 'vue'

export function openSaveModal(
  showSaveModal: Ref<boolean>,
  isDropdownOpen: Ref<boolean>,
) {
  showSaveModal.value = true
  isDropdownOpen.value = false
}

export function openPublishModal(
  showPublishModal: Ref<boolean>,
  isDropdownOpen: Ref<boolean>,
) {
  showPublishModal.value = true
  isDropdownOpen.value = false
}

export async function handleCreateConversation(
  categories: number[],
  selectedCategories: Ref<number[]>,
  setFieldValue: Function,
  showCategoryModal: Ref<boolean>,
) {
  selectedCategories.value = [...categories]
  await setFieldValue('categoriesId', [...categories])
  showCategoryModal.value = false
}

export function watchFormModification(
  initialvalues: Ref<any>,
  isConversationModified: Ref<boolean>,
) {
  return (newVal: any) => {
    if (!initialvalues.value) {
      return
    }
    const isModified =
      JSON.stringify(newVal) !== JSON.stringify(initialvalues.value)
    isConversationModified.value = isModified
  }
}
