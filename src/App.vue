<script setup>
import SideBar from '@/components/SideBar.vue'
import { useSettingStore } from '@/store/setting'
import { useThemeStore } from '@/store/theme'
import { onMounted, watch } from 'vue'

const settingStore = useSettingStore()
const themeStore = useThemeStore()

/// region 站点图标
watch(() => settingStore.settings.favicon, (val) => {
  document.querySelector('link[rel="icon"]').href = val
})
/// endregion 站点图标

// 去除加载动画
onMounted(() => document.querySelector('#ld').remove())

</script>

<template>
  <v-app>

    <v-app-bar class="app-bar align-center" elevation="0">
      <template #prepend>
        <v-btn @click="settingStore.sideBarOpened=true" class="d-flex d-lg-none" icon="mdi-menu"></v-btn>
        <v-app-bar-title class="rounded mr-2 d-none d-sm-flex" v-ripple>
          <router-link to="/" class="pa-2 text-decoration-none text-high-emphasis">
            {{ settingStore.settings?.siteTitle }}
          </router-link>
        </v-app-bar-title>
      </template>
      <template v-slot:append>
        <v-btn :icon="themeStore.isDark?'mdi-weather-night':'mdi-weather-sunny'"
               @click="themeStore.toggleTheme()"></v-btn>
        <a class="text-none v-btn--variant-text" :href="`mailto:${settingStore.settings?.email}`" target="_blank">
          <v-btn icon="mdi-at"></v-btn>
        </a>
        <a class="text-none v-btn--variant-text" href="https://github.com/FlapyPan/flapypan-blog" target="_blank">
          <v-btn icon="mdi-github"></v-btn>
        </a>
      </template>
    </v-app-bar>

    <side-bar></side-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
      </router-view>
      <footer class="text-center pt-2 pb-3 text-body-2 text-medium-emphasis">
        {{ settingStore.settings?.footer }}
      </footer>
    </v-main>

  </v-app>
</template>

<style>
</style>
