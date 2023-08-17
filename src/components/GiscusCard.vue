<script setup>
import { computed } from 'vue'
import 'giscus'
import { useThemeStore } from '@/store/theme'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()

// 检查所有设置，缺一不可
const valid = computed(() => !!(
  settingStore.settings.giscusRepo?.trim() !== '' &&
  settingStore.settings.giscusRepoId?.trim() !== '' &&
  settingStore.settings.giscusCategory?.trim() !== '' &&
  settingStore.settings.giscusCategoryId?.trim() !== ''
))

// 主题切换
const themeStore = useThemeStore()
const theme = computed(() => themeStore.isDark ? 'noborder_dark' : 'noborder_light')

</script>

<template>
  <div class="pt-8" v-if="valid">
    <v-divider class="my-8"></v-divider>
    <giscus-widget
      id="comments"
      :repo="settingStore.settings.giscusRepo"
      :repoid="settingStore.settings.giscusRepoId"
      :category="settingStore.settings.giscusCategory"
      :categoryid="settingStore.settings.giscusCategoryId"
      mapping="pathname"
      term="Welcome!"
      reactionsenabled="1"
      emitmetadata="0"
      inputposition="top"
      :theme="theme"
      lang="zh-CN"
      loading="eager"
    ></giscus-widget>
  </div>
</template>

<style scoped>

</style>
