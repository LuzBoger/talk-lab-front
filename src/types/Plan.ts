import type { Subscription } from "./Subscription"

export interface Plan {
  id: number
  name: string
  price: string
  description: string
  subscriptions?: Subscription[]
}