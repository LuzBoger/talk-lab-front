import type { ConversationContent } from './ConversationContent'

export interface ConversationListing {
  id?: number
  title: string
  description: string | undefined
  categoriesId: number[]
  isPublic: boolean
  createdAt?: string
  updatedAt?: string
  status: 'draft' | 'published'
  content: ConversationContent
  author?: string
}
