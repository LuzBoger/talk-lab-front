export interface User  {
    id: number
    name:string
    email:string
    username?:string
    avatarUrl?: string
    role?: string[]
    hasSubscription?: boolean
    subscriptionStatus?: string | null
}