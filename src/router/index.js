import { createRouter, createWebHistory } from 'vue-router'
import { useSettingStore } from '@/store/setting'

const keepAlive = true

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { keepAlive },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
  },
  {
    path: '/new',
    name: 'New',
    component: () => import('@/views/NewArticle.vue'),
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@/views/Setting.vue'),
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/views/Archive.vue'),
    meta: { keepAlive },
  },
  {
    path: '/tag',
    redirect: '/archive',
  },
  {
    path: '/tag/:tag',
    name: 'Tag',
    component: () => import('@/views/Tag.vue'),
    meta: { keepAlive },
  },
  {
    path: '/:path',
    name: 'Article',
    component: () => import('@/views/Article.vue'),
    meta: { keepAlive },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const settingStore = useSettingStore()
  if (to.name === 'Setting' && !settingStore.isLogin) {
    return { name: 'Home' }
  }
})

export default router
