import type  { ConversationContent } from './ConversationContent'

export interface Conversation {
    id?: number
    title: string
    description: string | undefined
    categoriesId: number[]
    creatorId: number 
    isPublic: boolean
    createdAt?: string
    status : 'draft' | 'published'
    content: ConversationContent
}