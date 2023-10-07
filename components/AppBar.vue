<script setup>
import { useDisplay } from 'vuetify'

const route = useRoute()
const settingStore = useSettingStore()
const { mobile } = useDisplay()

/// region 主题切换
const { theme, isDark, toggle: toggleTheme } = useDark()
onMounted(() => {
  const mediaQueryList = window.matchMedia?.('(prefers-color-scheme: dark)')
  if (mediaQueryList?.matches) theme.global.name.value = 'dark'
  mediaQueryList?.addEventListener('change', ({ matches }) => {
    theme.global.name.value = matches ? 'dark' : 'light'
  })
})
/// endregion 主题切换

const loginDialogVisible = ref(false)

function logout() {
  api({ url: `/auth/logout` }).finally(() => {
    location.reload()
  })
}
</script>

<template>
  <client-only>
    <v-dialog v-if="!settingStore.isLogin" v-model="loginDialogVisible" max-width="500px" close-on-back>
      <login-form @close="loginDialogVisible = false" />
    </v-dialog>
  </client-only>
  <v-app-bar class="app-bar align-center" elevation="0">
    <template #prepend>
      <client-only>
        <v-btn v-if="mobile" icon="mdi-menu" @click="settingStore.sideBarOpened = !settingStore.sideBarOpened"></v-btn>
      </client-only>
      <v-app-bar-title v-ripple class="rounded mr-2 d-none d-sm-flex">
        <v-btn :active="false" class="text-none text-h6" to="/">
          {{ settingStore.settings?.siteTitle }}
        </v-btn>
      </v-app-bar-title>
    </template>
    <template v-if="!mobile" #title>
      <v-btn
        class="text-none" to="/" rounded="xl" :active="route.name === 'index'"
        :color="route.name === 'index' ? 'light-blue' : ''">
        主页
      </v-btn>
      <v-btn
        v-for="{ name, url } in settingStore.links" :key="url" class="text-none" :to="`/${url}`"
        rounded="xl" :color="route.path.startsWith(`/${url}`) ? 'primary' : ''">
        {{ name }}
      </v-btn>
      <v-btn
        class="text-none" to="/archive" rounded="xl"
        :color="route.name === 'archive' ? 'orange' : ''">
        Archive
      </v-btn>
    </template>
    <template #append>
      <v-btn class="d-none d-sm-flex" icon="mdi-at" :href="`mailto:${settingStore.settings?.email}`"></v-btn>
      <v-btn class="d-none d-sm-flex" icon="mdi-github" href="https://github.com/FlapyPan/flapypan-blog"></v-btn>
      <client-only>
        <v-menu open-on-hover close-on-content-click>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text">
              <template #prepend>
                <v-avatar :image="settingStore.settings?.avatar" size="30" />
              </template>
              <span class="text-none">{{ settingStore.settings?.name }}</span>
              <template #append>
                <v-icon>mdi-menu-down</v-icon>
              </template>
            </v-btn>
          </template>
          <v-list elevation="1">
            <v-list-item v-if="settingStore.isLogin" to="/new" color="primary">
              <template #prepend>
                <v-avatar color="primary" size="28">
                  <v-icon color="white" class="text-body-1">
                    mdi-plus
                  </v-icon>
                </v-avatar>
              </template>
              新文章
            </v-list-item>
            <v-list-item v-if="settingStore.isLogin" to="/setting" color="blue">
              <template #prepend>
                <v-avatar color="blue" size="28">
                  <v-icon color="white" class="text-body-1">
                    mdi-cog
                  </v-icon>
                </v-avatar>
              </template>
              博客设置
            </v-list-item>
            <v-list-item v-if="settingStore.isLogin" color="red-lighten-1" @click="logout">
              <template #prepend>
                <v-avatar color="red-lighten-1" size="28">
                  <v-icon color="white" class="text-body-1">
                    mdi-logout
                  </v-icon>
                </v-avatar>
              </template>
              退出登录
            </v-list-item>
            <v-list-item v-else :active="loginDialogVisible" color="indigo" @click="loginDialogVisible = true">
              <template #prepend>
                <v-avatar color="indigo" size="28">
                  <v-icon color="white" class="text-body-1">
                    mdi-login
                  </v-icon>
                </v-avatar>
              </template>
              登录
            </v-list-item>
          </v-list>
        </v-menu>
        <client-only>
          <v-btn :icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'" @click="toggleTheme()">
          </v-btn>
        </client-only>
      </client-only>
      <v-btn to="/search" icon="mdi-magnify"></v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>
</style>
