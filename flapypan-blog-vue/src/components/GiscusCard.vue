<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'
import { useSettingStore } from '@/store/setting'
import Giscus from '@giscus/vue'

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
    <Giscus
      id="comments"
      :repo="settingStore.settings.giscusRepo"
      :repo-id="settingStore.settings.giscusRepoId"
      :category="settingStore.settings.giscusCategory"
      :category-id="settingStore.settings.giscusCategoryId"
      mapping="pathname"
      term="Welcome!"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="theme"
      lang="zh-CN"
      loading="eager"
    ></Giscus>
  </div>
</template>

<style scoped>

</style>
