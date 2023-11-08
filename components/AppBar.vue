<script setup>
import { Menu as HMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const settingStore = useSettingStore()

const navLinks = [
  {
    routeName: 'index',
    to: '/',
    activeColor: { text: 'text-primary-500', background: 'bg-primary-500' },
    title: '首页',
    icon: 'mingcute:home-1-line',
  },
  {
    routeName: 'archive',
    to: '/archive',
    activeColor: { text: 'text-orange-500', background: 'bg-orange-500' },
    title: '博客',
    icon: 'mingcute:archive-line',
  },
  {
    routeName: 'guestbook',
    to: '/guestbook',
    activeColor: { text: 'text-red-500', background: 'bg-red-500' },
    title: '留言墙',
    icon: 'mingcute:quill-pen-line',
  },
]

function logout() {
  api({ url: `/auth/logout` }).finally(() => {
    location.reload()
  })
}
</script>

<template>
  <client-only>
    <template v-if="!settingStore.isLogin">
      <f-dialog v-model="settingStore.loginDialogVisible" closable>
        <login-form @close="settingStore.loginDialogVisible = false" />
      </f-dialog>
    </template>
  </client-only>
  <header class="w-full fixed top-0 z-50 py-2">
    <div class="container h-12 mx-auto px-3 md:px-6 flex items-center">
      <h-menu v-slot="{ open }" as="div" class="relative inline-block md:hidden text-left">
        <menu-button
          :class="{ 'text-primary-500 bg-primary-500 bg-opacity-10': open }"
          class="flex items-center rounded-full bg-blur shadow p-3 sm:hover:text-primary-500 sm:hover:bg-primary-500 sm:hover:bg-opacity-10 cursor-pointer">
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
            class="absolute w-48 left-0 mt-4 px-2 py-2 origin-top-left shadow-lg bg-blur rounded-xl focus:outline-none">
            <menu-item v-for="l in navLinks" :key="l.routeName" v-slot="{ active }">
              <button
                :class="[$route.name === l.routeName || active ? `${l.activeColor.background} bg-opacity-10` : '']"
                :title="l.title"
                class="flex w-full items-center rounded-full px-2 py-2 my-1 text-sm"
                @click="navigateTo(l.to)">
                <icon :class="l.activeColor.text" :name="l.icon" class="mx-2" />
                {{ l.title }}
              </button>
            </menu-item>
            <menu-item
              v-for="{ name, url } in settingStore.links" :key="url" v-slot="{ active }">
              <button
                :class="[$route.path === `/${url}` || active ? 'bg-secondary-500 bg-opacity-10' : '']" :title="name"
                class="flex w-full items-center rounded-full px-2 py-2 my-1 text-sm"
                @click="navigateTo(`/${url}`)">
                <icon class="mx-2 text-secondary-400" name="mingcute:document-line" />
                {{ name }}
              </button>
            </menu-item>
          </menu-items>
        </transition>
      </h-menu>

      <nav class="items-center gap-4 text-sm underline-offset-2 hidden md:flex bg-blur shadow rounded-full py-3 px-5">
        <nuxt-link
          v-for="l in navLinks" :key="l.routeName"
          :class="{ [l.activeColor.text]: $route.name === l.routeName, [`sm:hover:${l.activeColor.text}`]: true }"
          :title="l.title"
          :to="l.to"
          class="flex items-center">
          <icon v-if="$route.name === l.routeName" :name="l.icon" class="mr-1" />
          {{ l.title }}
        </nuxt-link>
        <nuxt-link
          v-for="{ name, url } in settingStore.links" :key="url"
          :class="{ 'text-secondary-500': $route.path === `/${url}` }"
          :title="name"
          :to="`/${url}`"
          class="flex items-center sm:hover:text-secondary-500">
          <icon v-if="$route.path === `/${url}`" class="mr-1" name="mingcute:document-line" />
          {{ name }}
        </nuxt-link>
      </nav>

      <div class="flex-1"></div>

      <div class="flex items-center bg-blur shadow rounded-full py-1 px-2">
        <a
          :href="`mailto:${settingStore.settings?.email}`" class="p-2 text-xl items-center hidden sm:flex"
          title="邮箱联系我">
          <icon name="mingcute:at-line" />
        </a>
        <a class="p-2 text-xl flex items-center" href="https://github.com/FlapyPan/flapypan-blog" title="查看源码">
          <icon name="mdi:github" />
        </a>
        <client-only>
          <h-menu v-slot="{ open }" as="div" class="relative inline-block text-left cursor-pointer">
            <menu-button
              :class="{ 'text-primary-500 bg-primary-500 bg-opacity-10': open }"
              as="div"
              class="flex items-center rounded-full p-2 text-sm sm:hover:text-primary-500 sm:hover:bg-primary-500 sm:hover:bg-opacity-10">
              <img :src="settingStore.settings?.avatar" alt="头像" class="w-6 h-6 rounded-full">
              <span class="ml-2">{{ settingStore.settings?.name }}</span>
            </menu-button>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <menu-items
                class="absolute w-32 right-0 mt-4 px-2 py-2 origin-top-right rounded-xl shadow-lg bg-blur focus:outline-none">
                <menu-item v-if="settingStore.isLogin" v-slot="{ active }">
                  <button
                    :class="[$route.name === 'new' || active ? 'bg-secondary-500 bg-opacity-10' : '']"
                    class="group flex w-full items-center rounded-full px-2 py-2 my-1 text-sm"
                    @click="navigateTo('/new')">
                    <icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:add-line" />
                    写新文章
                  </button>
                </menu-item>
                <menu-item v-if="settingStore.isLogin" v-slot="{ active }">
                  <button
                    :class="[$route.name === 'setting' || active ? 'bg-primary-500 bg-opacity-10' : '']"
                    class="group flex w-full items-center rounded-full px-2 py-2 my-1 text-sm"
                    @click="navigateTo('/setting')">
                    <icon class="mr-2 h-5 w-5 text-primary-400" name="mingcute:settings-1-line" />
                    博客设置
                  </button>
                </menu-item>
                <menu-item v-if="settingStore.isLogin" v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-red-500 bg-opacity-10' : '']"
                    class="group flex w-full items-center rounded-full px-2 py-2 my-1 text-sm"
                    @click="logout">
                    <icon class="mr-2 h-5 w-5 text-red-400" name="mingcute:exit-line" />
                    退出登录
                  </button>
                </menu-item>
                <menu-item v-else v-slot="{ active }">
                  <button
                    :class="[active ? 'bg-violet-500 bg-opacity-10' : '']"
                    class="group flex w-full items-center rounded-full px-2 py-2 my-1 text-sm"
                    @click="settingStore.loginDialogVisible = true">
                    <icon class="mr-2 h-5 w-5 text-violet-400" name="mingcute:user-1-line" />
                    登录
                  </button>
                </menu-item>
              </menu-items>
            </transition>
          </h-menu>
        </client-only>
        <nuxt-link
          :class="{ 'text-violet-500 bg-violet-500 bg-opacity-5': $route.name === 'search' }"
          class="flex items-center text-xl ml-1 p-2 rounded-full sm:hover:text-violet-500 sm:hover:bg-violet-500 sm:hover:bg-opacity-10"
          title="搜索" to="/search">
          <icon name="mingcute:search-line" />
        </nuxt-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>
