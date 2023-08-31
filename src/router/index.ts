// router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue';
import Index from '@/views/pages/home/index.vue';
import Login from '@/views/pages/login/index.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    component: HelloWorld
  },
  {
    path: '/',
    component: Login
  },
  {
    path: '/Home',
    component: Index
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router