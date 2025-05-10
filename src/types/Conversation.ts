import type  { ConversationContent } from './ConversationContent'

export interface Conversation {
    id?: number
    title: string
    description: string | undefined
    category_id: number[]
    creator_id: number 
    createdAt: string
    updatedAt: string
    isPublic: boolean
    status : 'draft' | 'published'
    content: ConversationContent
}