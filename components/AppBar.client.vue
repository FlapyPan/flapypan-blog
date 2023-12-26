<script setup>
import { Menu as HMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const settingStore = useSettingStore()
const auth = useAuth()

const { data: links } = useAsyncData('pinnedLinks', () => api({ url: '/article/pinned' }), { server: false })

const scrolled = ref(false)

const state = ref('')
if (import.meta.browser) {
  window.addEventListener('scroll', () => {
    scrolled.value = document.documentElement.scrollTop > 48
  }, { passive: true })
  const eventSource = new EventSource('/api/status/author')
  eventSource.addEventListener('message', (event) => {
    state.value = event.data
  })
}

const navLinks = [
  {
    routeName: 'index',
    to: '/',
    activeColor: { text: 'text-primary-500', hoverText: 'sm:hover:text-primary-500', background: 'bg-primary-500' },
    title: '首页',
    icon: 'mingcute:home-1-line',
  },
  {
    routeName: 'archive',
    to: '/archive',
    activeColor: { text: 'text-orange-500', hoverText: 'sm:hover:text-orange-500', background: 'bg-orange-500' },
    title: '博客',
    icon: 'mingcute:archive-line',
  },
  {
    routeName: 'activity',
    to: '/activity',
    activeColor: { text: 'text-pink-500', hoverText: 'sm:hover:text-pink-500', background: 'bg-pink-500' },
    title: '活动',
    icon: 'mingcute:time-line',
  },
]

const colorModeCircle = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}
</script>

<template>
  <template v-if="!auth.state.value.isLogin">
    <f-dialog v-model="auth.state.value.loginDialogVisible" closable>
      <login-form @close="auth.state.value.loginDialogVisible = false" />
    </f-dialog>
  </template>
  <header class="w-full fixed top-0 z-50 py-2">
    <div class="container h-12 mx-auto px-3 md:px-6 flex items-center justify-center gap-2 md:gap-3">
      <h-menu v-slot="{ open }" as="div" class="relative inline-block md:hidden text-left">
        <menu-button
          :class="{ 'text-primary-500 bg-primary-500 bg-opacity-10': open, 'scrolled': scrolled, 'bg-blur': scrolled }"
          class="flex items-center rounded-full p-3 sm:hover:text-primary-500 sm:hover:bg-primary-500 sm:hover:bg-opacity-10 cursor-pointer">
          <icon
            :class="{ 'rotate-90': open }" :name="open ? 'mingcute:close-line' : 'mingcute:menu-line'"
            class="transform transition-transform" />
        </menu-button>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <menu-items
            class="absolute w-48 left-0 mt-4 p-1 origin-top-left shadow-lg bg-blur rounded-xl focus:outline-none">
            <menu-item v-for="l in navLinks" :key="l.routeName" v-slot="{ active }">
              <button
                :class="[$route.name === l.routeName || active ? `${l.activeColor.background} bg-opacity-10` : '']"
                :title="l.title"
                class="flex w-full items-center rounded-xl p-2 text-sm"
                @click="navigateTo(l.to)">
                <icon :class="l.activeColor.text" :name="l.icon" class="mr-2 h-5 w-5" />
                {{ l.title }}
              </button>
            </menu-item>
            <menu-item
              v-for="{ _id, title, path } in links" :key="_id" v-slot="{ active }">
              <button
                :class="[$route.path === `/${path}` || active ? 'bg-secondary-500 bg-opacity-10' : '']" :title="title"
                class="flex w-full items-center rounded-xl p-2 text-sm"
                @click="navigateTo(`/${path}`)">
                <icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:document-line" />
                {{ title }}
              </button>
            </menu-item>
          </menu-items>
        </transition>
      </h-menu>

      <nav
        :class="{ 'scrolled': scrolled, 'bg-blur': scrolled }"
        class="items-center gap-4 text-sm underline-offset-2 hidden md:flex rounded-full py-3 px-5">
        <nuxt-link
          v-for="l in navLinks" :key="l.routeName"
          :class="{ [l.activeColor.text]: $route.name === l.routeName, [`${l.activeColor.hoverText}`]: true }"
          :title="l.title"
          :to="l.to"
          class="flex items-center">
          <icon v-if="$route.name === l.routeName" :name="l.icon" class="mr-1" />
          {{ l.title }}
        </nuxt-link>
        <nuxt-link
          v-for="{ _id, title, path } in links" :key="_id"
          :class="{ 'text-secondary-500': $route.path === `/${path}` }"
          :title="title"
          :to="`/${path}`"
          class="flex items-center sm:hover:text-secondary-500">
          <icon v-if="$route.path === `/${path}`" class="mr-1" name="mingcute:document-line" />
          {{ title }}
        </nuxt-link>
      </nav>

      <button
        :class="{ 'scrolled': scrolled, 'bg-blur': scrolled }"
        class="flex items-center rounded-full p-3 sm:hover:text-primary-500 cursor-pointer"
        title="切换配色模式"
        @click="$colorMode.preference = colorModeCircle[$colorMode.preference]">
        <template v-if="$colorMode.preference === 'system'">
          <span class="flex md:hidden">
            <icon class="flex md:hidden" name="mingcute:cellphone-line" />
          </span>
          <span class="hidden md:flex">
            <icon class="hidden md:flex" name="mingcute:computer-line" />
          </span>
        </template>
        <template v-else-if="$colorMode.preference === 'light'">
          <icon name="mingcute:sun-line" />
        </template>
        <template v-else-if="$colorMode.preference === 'dark'">
          <icon name="mingcute:moon-line" />
        </template>
      </button>

      <div class="flex-1 flex md:hidden"></div>

      <div :class="{ 'scrolled': scrolled, 'bg-blur': scrolled }" class="flex items-center rounded-full gap-1">
        <h-menu v-slot="{ open }" as="div" class="relative inline-block text-left cursor-pointer">
          <menu-button
            :class="{ 'text-primary-500 bg-primary-500 bg-opacity-10': open }"
            as="div"
            class="flex items-center rounded-full px-4 text-sm sm:hover:text-primary-500">
            <img :src="settingStore.avatar" alt="" class="w-5 h-5 rounded-full">
            <div v-if="state" class="flex flex-col ml-2 text-xs py-1">
              <span>{{ settingStore.name }}</span>
              <span class="text-zinc-500" title="我的实时状态">{{ state }}</span>
            </div>
            <span v-else class="ml-2 py-3">{{ settingStore.name }}</span>
          </menu-button>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <menu-items
              class="absolute w-32 left-0 mt-4 p-1 origin-top-left rounded-xl shadow-lg bg-blur focus:outline-none">
              <menu-item v-if="auth.state.value.isLogin" v-slot="{ active }">
                <button
                  :class="[$route.name === 'new' || active ? 'bg-secondary-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm"
                  @click="navigateTo('/new')">
                  <icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:add-line" />
                  写新文章
                </button>
              </menu-item>
              <menu-item v-if="auth.state.value.isLogin" v-slot="{ active }">
                <button
                  :class="[$route.name === 'setting' || active ? 'bg-primary-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm"
                  @click="navigateTo('/setting')">
                  <icon class="mr-2 h-5 w-5 text-primary-400" name="mingcute:settings-1-line" />
                  博客设置
                </button>
              </menu-item>
              <menu-item v-if="auth.state.value.isLogin" v-slot="{ active }">
                <button
                  :class="[active ? 'bg-red-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm"
                  @click="auth.logout()">
                  <icon class="mr-2 h-5 w-5 text-red-400" name="mingcute:exit-line" />
                  退出登录
                </button>
              </menu-item>
              <menu-item v-else v-slot="{ active }">
                <button
                  :class="[active ? 'bg-violet-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm"
                  @click="auth.state.value.loginDialogVisible = true">
                  <icon class="mr-2 h-5 w-5 text-violet-400" name="mingcute:user-1-line" />
                  管理员登录
                </button>
              </menu-item>
            </menu-items>
          </transition>
        </h-menu>
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes app-bar-jump-in {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(15%);
  }
  100% {
    transform: translateY(0);
  }
}

.scrolled {
  @apply shadow;
  animation: app-bar-jump-in 0.3s;
}
</style>
