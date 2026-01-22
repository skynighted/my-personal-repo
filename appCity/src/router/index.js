import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      // name: 'home',
      // component: HomeView,
      // 路由重定向
      redirect:'/dashboard'
    },
    // 配置大屏路由
    {
      // 路由路径
      path: '/dashboard',
      // 路由名称
      name: 'dashboard',
      // 路由对应的组件页面
      component: ()=>import('../pages/index.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
