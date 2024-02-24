<script setup>
import { useAuthStore, useSettingStore } from '~/store';

const settingStore = useSettingStore();
const auth = useAuthStore();

const { data: links } = useLazyAsyncData('pinnedLinks', () => api('/article/pinned'), { deep: false });

const scrolled = shallowRef(false);
function checkScrolled() {
  requestAnimationFrame(checkScrolled);
  scrolled.value = document.documentElement.scrollTop > 64 || document.body.scrollTop > 64;
}
onMounted(checkScrolled);

const drawerVisible = ref(false);
function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value;
}

const state = shallowRef('');
onMounted(() => {
  const eventSource = new EventSource('/api/status/author');
  eventSource.addEventListener('message', (event) => {
    state.value = event.data;
  });
});

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
];

const colorModeCircle = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

/// region 访问量和其他数据
const { data: accessData } = await useLazyAsyncData(`access:base`, () => api(`/access`), {
  server: false,
  deep: false,
});
/// endregion
</script>

<template>
  <template>
    <Dialog v-model="auth.loginDialogVisible" closable>
      <LoginForm @close="auth.loginDialogVisible = false" />
    </Dialog>
  </template>
  <header
    :class="{ shadow: scrolled }"
    class="fixed top-0 z-50 w-full bg-zinc-50 px-3 transition-shadow dark:bg-zinc-900 md:px-6 print:hidden">
    <div
      :class="`${scrolled ? 'h-10' : 'h-16'}`"
      class="container mx-auto flex max-w-6xl items-center gap-2 transition-all">
      <button
        class="flex cursor-pointer items-center p-3 sm:hover:text-primary-500 md:hidden"
        @click="toggleDrawer()">
        <Icon name="mingcute:menu-line" class="transform transition-transform" />
      </button>
      <Drawer class="block md:hidden" v-model="drawerVisible" max-size="80vw">
        <ul class="rounded-xl bg-zinc-100 p-2 shadow-md dark:bg-zinc-900">
          <li v-for="l in navLinks" :key="l.routeName">
            <button
              :class="[
                $route.name === l.routeName ? `${l.activeColor.background} bg-opacity-10` : '',
              ]"
              :title="l.title"
              class="flex w-full items-center rounded-xl p-2 text-sm"
              @click="
                drawerVisible = false;
                navigateTo(l.to);
              ">
              <Icon :class="l.activeColor.text" :name="l.icon" class="mr-2 h-5 w-5" />
              {{ l.title }}
            </button>
          </li>
          <li v-for="{ _id, title, path } in links" :key="_id">
            <button
              :class="[$route.path === `/${path}` ? 'bg-secondary-500 bg-opacity-10' : '']"
              :title="title"
              class="flex w-full items-center rounded-xl p-2 text-sm"
              @click="
                drawerVisible = false;
                navigateTo(`/${path}`);
              ">
              <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:document-line" />
              {{ title }}
            </button>
          </li>
        </ul>
      </Drawer>

      <nav class="hidden items-center gap-4 px-5 py-3 text-sm underline-offset-2 md:flex">
        <nuxt-link
          v-for="l in navLinks"
          :key="l.routeName"
          :class="{
            [l.activeColor.text]: $route.name === l.routeName,
            [`${l.activeColor.hoverText}`]: true,
          }"
          :title="l.title"
          :to="l.to"
          class="flex items-center">
          <Icon v-if="$route.name === l.routeName" :name="l.icon" class="mr-1" />
          {{ l.title }}
        </nuxt-link>
        <nuxt-link
          v-for="{ _id, title, path } in links"
          :key="_id"
          :class="{ 'text-secondary-500': $route.path === `/${path}` }"
          :title="title"
          :to="`/${path}`"
          class="flex items-center sm:hover:text-secondary-500">
          <Icon v-if="$route.path === `/${path}`" class="mr-1" name="mingcute:document-line" />
          {{ title }}
        </nuxt-link>
      </nav>

      <div class="flex-1"></div>

      <button
        class="flex items-center px-4 text-sm sm:hover:text-primary-500"
        @click="settingStore.rightDrawer = !settingStore.rightDrawer">
        <img :src="settingStore.setting.avatar" alt="" class="h-5 w-5 rounded-full" />
        <span v-if="state" class="ml-2 flex flex-col py-1 text-xs">
          <span>{{ settingStore.setting.name }}</span>
          <span class="text-zinc-500" title="我的实时状态">{{ state }}</span>
        </span>
        <span v-else class="ml-2 py-3">{{ settingStore.setting.name }}</span>
      </button>
      <Drawer v-model="settingStore.rightDrawer" max-size="12rem" size="12rem" location="right">
        <div class="rounded-xl bg-zinc-100 p-2 shadow-md dark:bg-zinc-900">
          <button
            title="切换配色"
            class="flex w-full items-center rounded-xl p-2 text-sm"
            @click="$colorMode.preference = colorModeCircle[$colorMode.preference]">
            <template v-if="$colorMode.preference === 'system'">
              <span class="flex md:hidden">
                <Icon class="mr-2 h-5 w-5" name="mingcute:cellphone-line" />
              </span>
              <span class="hidden md:flex">
                <Icon class="mr-2 h-5 w-5" name="mingcute:computer-line" />
              </span>
            </template>
            <template v-else-if="$colorMode.preference === 'light'">
              <Icon name="mingcute:sun-line" class="mr-2 h-5 w-5" />
            </template>
            <template v-else-if="$colorMode.preference === 'dark'">
              <Icon name="mingcute:moon-line" class="mr-2 h-5 w-5" />
            </template>
            切换配色
          </button>
        </div>
        <div
          class="mt-2 flex flex-col gap-2 rounded-xl bg-zinc-100 p-4 text-xs shadow-md dark:bg-zinc-900">
          <p v-if="accessData?.today">今日访问量：{{ accessData.today }}</p>
          <p v-if="accessData?.all">总访问量：{{ accessData.all }}</p>
        </div>
        <ul class="mt-2 rounded-xl bg-zinc-100 p-2 shadow-md dark:bg-zinc-900">
          <li v-if="auth.isLogin">
            <button
              :class="[$route.name === 'new' ? 'bg-secondary-500 bg-opacity-10' : '']"
              class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-10"
              @click="
                settingStore.rightDrawer = false;
                navigateTo('/new');
              ">
              <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:add-line" />
              写新文章
            </button>
          </li>
          <li v-if="auth.isLogin">
            <button
              :class="[$route.name === 'setting' ? 'bg-primary-500 bg-opacity-10' : '']"
              class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-primary-500 hover:bg-opacity-10"
              @click="
                settingStore.rightDrawer = false;
                navigateTo('/setting');
              ">
              <Icon class="mr-2 h-5 w-5 text-primary-400" name="mingcute:settings-1-line" />
              博客设置
            </button>
          </li>
          <li v-if="auth.isLogin">
            <button
              class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-red-500 hover:bg-opacity-10"
              @click="auth.logout()">
              <Icon class="mr-2 h-5 w-5 text-red-400" name="mingcute:exit-line" />
              退出登录
            </button>
          </li>
          <li v-else>
            <button
              class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-violet-500 hover:bg-opacity-10"
              @click="auth.loginDialogVisible = true">
              <Icon class="mr-2 h-5 w-5 text-violet-400" name="mingcute:user-1-line" />
              管理员登录
            </button>
          </li>
        </ul>
      </Drawer>
    </div>
  </header>
</template>
