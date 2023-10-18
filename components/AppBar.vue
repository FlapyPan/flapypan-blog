<script setup>
import { Menu as HMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const settingStore = useSettingStore()

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
  <header class="w-full fixed top-0 sm:top-2 z-50">
    <div class="container h-14 mx-auto px-3 md:px-6 flex items-center bg-blur shadow rounded-none sm:rounded-xl">
      <h-menu v-slot="{ open }" as="div" class="relative inline-block md:hidden text-left">
        <div>
          <menu-button
            class="flex items-center rounded-md p-2 sm:hover:text-primary-500 sm:hover:bg-primary-500 sm:hover:bg-opacity-10 cursor-pointer"
            :class="{ 'text-primary-500 bg-primary-500 bg-opacity-10': open }">
            <icon
              class="transform transition-transform" :class="{ 'rotate-90': open }"
              :name="open ? 'mingcute:close-line' : 'mingcute:menu-line'" />
          </menu-button>
        </div>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <menu-items
            class="absolute w-64 left-0 mt-4 px-2 py-2 origin-top-left rounded-md shadow-lg bg-blur focus:outline-none flex flex-col gap-1">
            <menu-item v-slot="{ active }" class="p-1 cursor-pointer">
              <button
                class="flex items-center rounded-md" title="主页"
                :class="[$route.name === 'index' || active ? 'bg-primary-500 bg-opacity-10' : '']"
                @click="navigateTo('/')">
                <icon name="mingcute:home-1-line" class="mr-2 text-primary-400" />
                首页
              </button>
            </menu-item>
            <menu-item v-slot="{ active }" class="p-1 cursor-pointer">
              <button
                class="flex items-center rounded-md" title="归档"
                :class="[$route.name === 'archive' || active ? 'bg-orange-500 bg-opacity-10' : '']"
                @click="navigateTo('/archive')">
                <icon name="mingcute:archive-line" class="mr-2 text-orange-400" />
                博客
              </button>
            </menu-item>
            <menu-item v-slot="{ active }" class="p-1 cursor-pointer">
              <button
                class="flex items-center rounded-md" title="归档"
                :class="[$route.name === 'guestbook' || active ? 'bg-red-500 bg-opacity-10' : '']"
                @click="navigateTo('/guestbook')">
                <icon name="mingcute:quill-pen-line" class="mr-2 text-red-400" />
                留言墙
              </button>
            </menu-item>
            <menu-item
              v-for="{ name, url } in settingStore.links" v-slot="{ active }" :key="url"
              class="p-1 cursor-pointer">
              <button
                class="flex items-center rounded-md" :title="name"
                :class="[$route.path === `/${url}` || active ? 'bg-secondary-500 bg-opacity-10' : '']"
                @click="navigateTo(`/${url}`)">
                <icon name="mingcute:document-line" class="mr-2 text-secondary-400" />
                {{ name }}
              </button>
            </menu-item>
          </menu-items>
        </transition>
      </h-menu>

      <nav class="items-center gap-4 text-sm underline-offset-2 hidden md:flex">
        <nuxt-link
          to="/" title="主页"
          class="flex items-center sm:hover:text-primary-500"
          :class="{ 'text-primary-500': $route.name === 'index' }">
          <icon v-if="$route.name === 'index'" name="mingcute:home-1-line" class="mr-1" />
          首页
        </nuxt-link>
        <nuxt-link
          to="/archive" title="归档"
          class="flex items-center sm:hover:text-orange-500"
          :class="{ 'text-orange-500': $route.name === 'archive' }">
          <icon v-if="$route.name === 'archive'" name="mingcute:archive-line" class="mr-1" />
          博客
        </nuxt-link>
        <nuxt-link
          to="/guestbook" title="归档"
          class="flex items-center sm:hover:text-red-500"
          :class="{ 'text-red-500': $route.name === 'guestbook' }">
          <icon v-if="$route.name === 'guestbook'" name="mingcute:quill-pen-line" class="mr-1" />
          留言墙
        </nuxt-link>
        <nuxt-link
          v-for="{ name, url } in settingStore.links" :key="url" :to="`/${url}`" :title="name"
          class="flex items-center sm:hover:text-secondary-500"
          :class="{ 'text-secondary-500': $route.path === `/${url}` }">
          <icon v-if="$route.path === `/${url}`" name="mingcute:document-line" class="mr-1" />
          {{ name }}
        </nuxt-link>
      </nav>

      <div class="flex-1"></div>

      <a
        class="p-2 text-xl items-center hidden sm:flex" :href="`mailto:${settingStore.settings?.email}`"
        title="邮箱联系我">
        <icon name="mingcute:at-line" />
      </a>
      <a class="p-2 text-xl flex items-center" href="https://github.com/FlapyPan/flapypan-blog" title="查看源码">
        <icon name="mdi:github" />
      </a>
      <client-only>
        <h-menu v-slot="{ open }" as="div" class="relative inline-block text-left cursor-pointer">
          <menu-button
            as="div"
            class="flex items-center rounded-md p-2 text-sm sm:hover:text-primary-500 sm:hover:bg-primary-500 sm:hover:bg-opacity-10"
            :class="{ 'text-primary-500 bg-primary-500 bg-opacity-10': open }">
            <img class="w-6 h-6 rounded-full" :src="settingStore.settings?.avatar" alt="头像">
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
              class="absolute w-32 right-0 mt-4 px-2 py-2 origin-top-right rounded-md shadow-lg bg-blur focus:outline-none">
              <menu-item v-if="settingStore.isLogin" v-slot="{ active }">
                <button
                  class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  :class="[$route.name === 'new' || active ? 'bg-secondary-500 bg-opacity-10' : '']"
                  @click="navigateTo('/new')">
                  <icon name="mingcute:add-line" class="mr-2 h-5 w-5 text-secondary-400" />
                  写新文章
                </button>
              </menu-item>
              <menu-item v-if="settingStore.isLogin" v-slot="{ active }">
                <button
                  class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  :class="[$route.name === 'setting' || active ? 'bg-primary-500 bg-opacity-10' : '']"
                  @click="navigateTo('/setting')">
                  <icon name="mingcute:settings-1-line" class="mr-2 h-5 w-5 text-primary-400" />
                  博客设置
                </button>
              </menu-item>
              <menu-item v-if="settingStore.isLogin" v-slot="{ active }">
                <button
                  class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  :class="[active ? 'bg-red-500 bg-opacity-10' : '']"
                  @click="logout">
                  <icon name="mingcute:exit-line" class="mr-2 h-5 w-5 text-red-400" />
                  退出登录
                </button>
              </menu-item>
              <menu-item v-else v-slot="{ active }">
                <button
                  class="group flex w-full items-center rounded-md px-2 py-2 text-sm"
                  :class="[active ? 'bg-violet-500 bg-opacity-10' : '']"
                  @click="settingStore.loginDialogVisible = true">
                  <icon name="mingcute:user-1-line" class="mr-2 h-5 w-5 text-violet-400" />
                  登录
                </button>
              </menu-item>
            </menu-items>
          </transition>
        </h-menu>
      </client-only>

      <nuxt-link
        class="flex items-center text-xl ml-1 p-2 rounded-lg sm:hover:text-violet-500 sm:hover:bg-violet-500 sm:hover:bg-opacity-10"
        :class="{ 'text-violet-500 bg-violet-500 bg-opacity-5': $route.name === 'search' }" to="/search" title="搜索">
        <icon name="mingcute:search-line" />
      </nuxt-link>
    </div>
  </header>
</template>

<style scoped>
</style>
