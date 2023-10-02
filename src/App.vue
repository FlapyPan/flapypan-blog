<script setup>
import { useSettingStore } from '@/store/setting'
import { onMounted, watch } from 'vue'
import AppBar from '@/components/AppBar.vue'
import SideBar from '@/components/SideBar.vue'

const settingStore = useSettingStore()

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
    <app-bar />
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
    <side-bar />
  </v-app>
</template>

<style>
</style>
