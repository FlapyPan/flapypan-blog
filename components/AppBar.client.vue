<script setup lang="ts">
import { useScroll, useToggle, watchPausable } from '@vueuse/core'
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

const { arrivedState, directions } = useScroll(window, { eventListenerOptions: { passive: true }, throttle: 200 })
const subOpened = shallowRef(false)
const watchScroll = watchPausable(directions, ({ top, bottom }) => {
  if (subOpened.value && top) {
    subOpened.value = false
  } else if (!subOpened.value && bottom) {
    subOpened.value = true
  }
})
const ignoreRouteNames = [
  'archive',
  'activity',
  'new',
  'setting',
]
watch(() => route.name, (name) => {
  if (ignoreRouteNames.includes(name as string)) {
    subOpened.value = false
    watchScroll.pause()
  } else {
    watchScroll.resume()
  }
}, { immediate: true })

const [drawerVisible, toggleDrawer] = useToggle(false)

function navigateToPath(path: string) {
  toggleDrawer(false)
  navigateTo(path)
}

function openLogin() {
  toggleDrawer(false)
  auth.loginDialogVisible = true
}

const navLinks = [
  {
    routeName: 'index',
    to: '/',
    activeColor: {
      text: 'text-primary-500',
      hoverText: 'sm:hover:text-primary-500',
      background: 'bg-primary-500/10',
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
      background: 'bg-orange-500/10',
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
      background: 'bg-pink-500/10',
    },
    title: '活动',
    icon: 'mingcute:time-line',
  },
]
</script>

<template>
  <div class="fixed top-0 z-50 h-10 w-full sm:top-2">
    <Dialog v-model="auth.loginDialogVisible" closable>
      <LoginForm @close="auth.loginDialogVisible = false" />
    </Dialog>
    <header
      class="mx-auto size-full max-w-5xl overflow-hidden px-3 duration-300 sm:rounded-full md:px-6 print:hidden"
      :class="[arrivedState.top ? '' : 'card', subOpened ? 'max-w-4xl' : 'max-w-6xl']"
      @contextmenu.stop.prevent="toggleDrawer()"
    >
      <div
        :class="{ '-translate-y-full': subOpened }"
        class="mx-auto flex h-10 flex-row-reverse items-center justify-between transition-transform duration-200 md:flex-row"
      >
        <nav class="hidden items-center gap-3 text-sm underline-offset-2 md:flex">
          <Btn
            v-for="l in navLinks"
            :key="l.routeName"
            class="text-current"
            :class="{
              [l.activeColor.text]: $route.name === l.routeName,
              [`${l.activeColor.hoverText}`]: true,
            }"
            :title="l.title"
            :to="l.to"
            :icon="l.icon"
            text
          >
            {{ l.title }}
          </Btn>
          <Btn
            v-for="{ _id, title, path } in links"
            :key="_id"
            :class="{ 'text-secondary-500': $route.path === `/${path}` }"
            :title="title"
            :to="`/${path}`"
            icon="mingcute:document-line"
            text
            class="hidden hover:text-secondary-500 lg:inline-flex"
          >
            {{ title }}
          </Btn>
        </nav>

        <div class="hidden flex-1 md:block" />

        <button
          class="flex items-center pr-1 text-sm transition-colors sm:hover:text-primary-500"
          @click="toggleDrawer()"
        >
          <img :src="settingStore.setting.avatar" alt="" class="size-5 rounded-full">
          <span class="ml-2 py-3">{{ settingStore.setting.name }}</span>
        </button>
        <Drawer v-model="drawerVisible" max-size="80vw" location="right">
          <div class="m-2">
            <ul class="card block rounded-xl p-2 lg:hidden">
              <li v-for="l in navLinks" :key="l.routeName" class="block md:hidden">
                <button
                  :class="$route.name === l.routeName ? l.activeColor.background : ''"
                  :title="l.title"
                  class="flex w-full items-center rounded-xl p-2 text-sm"
                  @click="navigateToPath(l.to)"
                >
                  <Icon :class="l.activeColor.text" :name="l.icon" class="mr-2 size-5" />
                  {{ l.title }}
                </button>
              </li>
              <li v-for="{ _id, title, path } in links" :key="_id" class="block lg:hidden">
                <button
                  :class="$route.path === `/${path}` ? 'bg-secondary-500/10' : ''"
                  :title="title"
                  class="flex w-full items-center rounded-xl p-2 text-sm"
                  @click="navigateToPath(`/${path}`)"
                >
                  <Icon class="mr-2 size-5 text-secondary-400" name="mingcute:document-line" />
                  {{ title }}
                </button>
              </li>
            </ul>
            <ul class="card mt-2 rounded-xl p-1">
              <li v-if="auth.isLogin">
                <button
                  :class="$route.name === 'new' ? 'bg-secondary-500/10' : ''"
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500/10"
                  @click="navigateToPath('/new')"
                >
                  <Icon class="mr-2 size-5 text-secondary-400" name="mingcute:add-line" />
                  写新文章
                </button>
              </li>
              <li v-if="auth.isLogin">
                <button
                  :class="$route.name === 'setting' ? 'bg-primary-500/10' : ''"
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-primary-500/10"
                  @click="navigateToPath('/setting')"
                >
                  <Icon class="mr-2 size-5 text-primary-400" name="mingcute:settings-1-line" />
                  博客设置
                </button>
              </li>
              <li v-if="auth.isLogin">
                <button
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-red-500/10"
                  @click="auth.logout()"
                >
                  <Icon class="mr-2 size-5 text-red-400" name="mingcute:exit-line" />
                  退出登录
                </button>
              </li>
              <li v-else>
                <button
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-violet-500/10"
                  @click="openLogin()"
                >
                  <Icon class="mr-2 size-5 text-violet-400" name="mingcute:user-1-line" />
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
        class="h-10 overflow-hidden transition-transform duration-200"
        :class="{ '-translate-y-10': subOpened }"
      />
    </header>
  </div>
</template>
