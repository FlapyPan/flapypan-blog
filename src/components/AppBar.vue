<script setup>
import { ref } from 'vue'
import { useSettingStore } from '@/store/setting'
import { useThemeStore } from '@/store/theme'
import LoginDialog from '@/components/LoginDialog.vue'
import { api } from '@/api'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'

const router = useRouter()
const settingStore = useSettingStore()
const themeStore = useThemeStore()
const { mobile } = useDisplay()

const logout = () => {
  api(`/auth/logout`).finally(() => {
    localStorage.removeItem('token')
    location.reload()
  })
}
</script>

<template>
  <login-dialog />
  <v-app-bar class="app-bar align-center" elevation="0">
    <template #prepend>
      <v-btn @click="settingStore.sideBarOpened=!settingStore.sideBarOpened" v-if="mobile" icon="mdi-menu"></v-btn>
      <v-app-bar-title class="rounded mr-2 d-none d-sm-flex" v-ripple>
        <v-btn :active="false" class="text-none text-h6" to="/">{{ settingStore.settings?.siteTitle }}</v-btn>
      </v-app-bar-title>
    </template>
    <template #title v-if="!mobile">
      <v-btn class="text-none" to="/" rounded="xl" :active="router.currentRoute.value.name==='Home'"
             :color="router.currentRoute.value.name==='Home'?'light-blue':''">主页
      </v-btn>
      <v-btn class="text-none" v-for="{name,url} in settingStore.links" :to="`/${url}`" :key="url"
             rounded="xl" :color="router.currentRoute.value.path.startsWith(`/${url}`)?'primary':''">
        {{ name }}
      </v-btn>
      <v-btn class="text-none" to="/archive" rounded="xl"
             :color="router.currentRoute.value.name==='Archive'?'orange':''">Archive
      </v-btn>
    </template>
    <template v-slot:append>
      <v-btn class="d-none d-sm-flex" icon="mdi-at" :href="`mailto:${settingStore.settings?.email}`"></v-btn>
      <v-btn class="d-none d-sm-flex" icon="mdi-github" href="https://github.com/FlapyPan/flapypan-blog"></v-btn>
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
            <template v-slot:prepend>
              <v-avatar color="primary" size="28">
                <v-icon color="white" class="text-body-1">mdi-plus</v-icon>
              </v-avatar>
            </template>
            新文章
          </v-list-item>
          <v-list-item v-if="settingStore.isLogin" to="/setting" color="blue">
            <template v-slot:prepend>
              <v-avatar color="blue" size="28">
                <v-icon color="white" class="text-body-1">mdi-cog</v-icon>
              </v-avatar>
            </template>
            博客设置
          </v-list-item>
          <v-list-item v-if="settingStore.isLogin" @click="logout" color="red-lighten-1">
            <template v-slot:prepend>
              <v-avatar color="red-lighten-1" size="28">
                <v-icon color="white" class="text-body-1">mdi-logout</v-icon>
              </v-avatar>
            </template>
            退出登录
          </v-list-item>
          <v-list-item v-else @click="settingStore.loginDialogOpened=true" :active="settingStore.loginDialogOpened" color="indigo">
            <template v-slot:prepend>
              <v-avatar color="indigo" size="28">
                <v-icon color="white" class="text-body-1">mdi-login</v-icon>
              </v-avatar>
            </template>
            登录
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn :icon="themeStore.isDark?'mdi-weather-night':'mdi-weather-sunny'"
             @click="themeStore.toggleTheme()"></v-btn>
      <v-btn to="/search" icon="mdi-magnify"></v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped>

</style>
