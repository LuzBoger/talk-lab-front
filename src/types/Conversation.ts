import type  { ConversationContent } from './ConversationContent'

export interface Conversation {
    id?: number
    title: string
    description: string | undefined
    categoriesId: number[]
    creatorId: number 
    isPublic: boolean
    status : 'draft' | 'published'
    content: ConversationContent
}