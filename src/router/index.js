import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=>import('../views/HomeView.vue')
    },
    {
      path:'/demo1',
      name:'demo1',
      component:()=>import('../views/Demo1.vue')
    },
    {
      path:'/demo2',
      name:'demo2',
      component:()=>import('../views/Demo2.vue')
    },
  ]
})

export default router
