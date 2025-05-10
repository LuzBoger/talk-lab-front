import { createRouter, createWebHistory } from 'vue-router'
import ConversationList from '../components/ConversationList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ConversationList,
  },
    {
    path: '/conversation/create',
    name: 'Conversation',
    component: () => import('../conversation/index.vue'),
    props: true,
  },

  {
    path: '/conversation/:id',
    name: 'Conversation',
    component: () => import('../conversation/[id].vue'),
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
