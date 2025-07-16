export type Messages = {
  author: 'user' | 'interlocutor'
  message: string
  time?: string
  isSeen?: boolean
  reaction?: string
  image?: string
  audio?: string
}
