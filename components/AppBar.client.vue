<script setup lang="ts">
import { useIntervalFn, useScroll, useThrottleFn, useToggle } from '@vueuse/core'
import type { ArticleWithoutContent } from '~/types/api'
import { useAuthStore, useSettingStore } from '~/store'

const settingStore = useSettingStore()
const auth = useAuthStore()
const route = useRoute()

const { data: links } = useLazyAsyncData(
  'pinnedLinks',
  () => api<Partial<ArticleWithoutContent>[]>('/article/pinned'),
  { deep: false },
)

const [subOpened, toggleSubOpened] = useToggle(false)
const debouncedToggleSubOpened = useThrottleFn(toggleSubOpened, 500)
let lastScrollTop = 0
const ignoreRouteNames = [
  'archive',
  'activity',
  'new',
  'setting',
]
const { y, arrivedState } = useScroll(window, { offset: { top: 16 } })
const watchScroll = useIntervalFn(() => {
  if (subOpened.value && y.value < lastScrollTop) {
    debouncedToggleSubOpened()
  } else if (!subOpened.value && y.value > lastScrollTop) {
    debouncedToggleSubOpened()
  }
  lastScrollTop = y.value
}, 100)
watch(() => route.name, (name) => {
  toggleSubOpened(false)
  if (ignoreRouteNames.includes(name as string)) {
    watchScroll.pause()
  } else {
    watchScroll.resume()
  }
}, { immediate: true })

const drawerVisible = ref(false)

function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value
}

function navigateToPath(path: string) {
  drawerVisible.value = false
  navigateTo(path)
}

function openLogin() {
  drawerVisible.value = false
  auth.loginDialogVisible = true
}

const state = shallowRef('')
onMounted(() => {
  const eventSource = new EventSource('/api/status/author')
  eventSource.addEventListener('message', (event) => {
    state.value = event.data
  })
})

const navLinks = [
  {
    routeName: 'index',
    to: '/',
    activeColor: {
      text: 'text-primary-500',
      hoverText: 'sm:hover:text-primary-500',
      background: 'bg-primary-500',
    },
    title: '首页',
    icon: 'mingcute:home-1-line',
  },
  {
    routeName: 'archive',
    to: '/archive',
    activeColor: {
      text: 'text-orange-500',
      hoverText: 'sm:hover:text-orange-500',
      background: 'bg-orange-500',
    },
    title: '博客',
    icon: 'mingcute:archive-line',
  },
  {
    routeName: 'activity',
    to: '/activity',
    activeColor: {
      text: 'text-pink-500',
      hoverText: 'sm:hover:text-pink-500',
      background: 'bg-pink-500',
    },
    title: '活动',
    icon: 'mingcute:time-line',
  },
]
</script>

<template>
  <Dialog v-model="auth.loginDialogVisible" closable>
    <LoginForm @close="auth.loginDialogVisible = false" />
  </Dialog>
  <header
    class="fixed top-0 z-50 w-full overflow-hidden duration-200 px-3 md:px-6 print:hidden rounded-b-lg"
    :class="[subOpened ? 'h-10' : 'h-12',
             arrivedState.top ? '' : 'backdrop-blur-lg bg-white bg-opacity-80 dark:bg-black dark:bg-opacity-60 shadow']"
    @contextmenu.stop.prevent="toggleDrawer"
  >
    <div
      :class="{ '-translate-y-full': subOpened }"
      class="container h-12 mx-auto flex flex-row-reverse items-center justify-between transition-transform duration-200 md:flex-row"
    >
      <nav class="hidden items-center gap-3 text-sm underline-offset-2 md:flex">
        <nuxt-link
          v-for="l in navLinks"
          :key="l.routeName"
          :class="{
            [l.activeColor.text]: $route.name === l.routeName,
            [`${l.activeColor.hoverText}`]: true,
          }"
          :title="l.title"
          :to="l.to"
          class="flex items-center transition-colors"
        >
          <Icon :name="l.icon" class="mr-1" />
          {{ l.title }}
        </nuxt-link>
        <nuxt-link
          v-for="{ _id, title, path } in links"
          :key="_id"
          :class="{ 'text-secondary-500': $route.path === `/${path}` }"
          :title="title"
          :to="`/${path}`"
          class="hidden items-center transition-colors sm:hover:text-secondary-500 lg:flex"
        >
          <Icon class="mr-1" name="mingcute:document-line" />
          {{ title }}
        </nuxt-link>
      </nav>

      <div class="hidden flex-1 md:block" />

      <button
        class="flex items-center pr-1 text-sm transition-colors sm:hover:text-primary-500"
        @click="toggleDrawer()"
      >
        <img :src="settingStore.setting.avatar" alt="" class="h-5 w-5 rounded-full">
        <span v-if="state" class="ml-2 flex flex-col py-1 text-xs">
          <span>{{ settingStore.setting.name }}</span>
          <span class="text-zinc-500" title="我的实时状态">{{ state }}</span>
        </span>
        <span v-else class="ml-2 py-3">{{ settingStore.setting.name }}</span>
      </button>
      <Drawer v-model="drawerVisible" max-size="80vw" location="right">
        <div class="m-2">
          <ul class="block rounded-xl bg-zinc-50 p-2 border-all dark:bg-zinc-900 lg:hidden">
            <li v-for="l in navLinks" :key="l.routeName" class="block md:hidden">
              <button
                :class="[
                  $route.name === l.routeName ? `${l.activeColor.background} bg-opacity-10` : '',
                ]"
                :title="l.title"
                class="flex w-full items-center rounded-xl p-2 text-sm"
                @click="navigateToPath(l.to)"
              >
                <Icon :class="l.activeColor.text" :name="l.icon" class="mr-2 h-5 w-5" />
                {{ l.title }}
              </button>
            </li>
            <li v-for="{ _id, title, path } in links" :key="_id" class="block lg:hidden">
              <button
                :class="[$route.path === `/${path}` ? 'bg-secondary-500 bg-opacity-10' : '']"
                :title="title"
                class="flex w-full items-center rounded-xl p-2 text-sm"
                @click="navigateToPath(`/${path}`)"
              >
                <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:document-line" />
                {{ title }}
              </button>
            </li>
          </ul>
          <ul class="mt-2 rounded-xl bg-zinc-50 p-1 border-all dark:bg-zinc-900">
            <li v-if="auth.isLogin">
              <button
                :class="[$route.name === 'new' ? 'bg-secondary-500 bg-opacity-10' : '']"
                class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-10"
                @click="navigateToPath('/new')"
              >
                <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:add-line" />
                写新文章
              </button>
            </li>
            <li v-if="auth.isLogin">
              <button
                :class="[$route.name === 'setting' ? 'bg-primary-500 bg-opacity-10' : '']"
                class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-primary-500 hover:bg-opacity-10"
                @click="navigateToPath('/setting')"
              >
                <Icon class="mr-2 h-5 w-5 text-primary-400" name="mingcute:settings-1-line" />
                博客设置
              </button>
            </li>
            <li v-if="auth.isLogin">
              <button
                class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-red-500 hover:bg-opacity-10"
                @click="auth.logout()"
              >
                <Icon class="mr-2 h-5 w-5 text-red-400" name="mingcute:exit-line" />
                退出登录
              </button>
            </li>
            <li v-else>
              <button
                class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-violet-500 hover:bg-opacity-10"
                @click="openLogin()"
              >
                <Icon class="mr-2 h-5 w-5 text-violet-400" name="mingcute:user-1-line" />
                管理员登录
              </button>
            </li>
          </ul>
        </div>
      </Drawer>

      <div class="block flex-1 md:hidden" />

      <ColorModeSwitch />
    </div>
    <div
      id="app-bar"
      class="mx-auto max-w-6xl transition-transform duration-200 h-10 overflow-hidden px-2"
      :class="{ '-translate-y-12': subOpened }"
    />
  </header>
</template>
