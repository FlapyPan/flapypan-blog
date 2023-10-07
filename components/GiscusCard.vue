<script setup>
import { useTheme } from 'vuetify'

const settingStore = useSettingStore()
// 所有设置，缺一不可
const valid = computed(() => !!(
  settingStore.value.settings.giscusRepo?.trim() !== ''
  && settingStore.value.settings.giscusRepoId?.trim() !== ''
  && settingStore.value.settings.giscusCategory?.trim() !== ''
  && settingStore.value.settings.giscusCategoryId?.trim() !== ''
))

// 主题切换
const themeInstance = useTheme()
const theme = computed(() => themeInstance.current.value.dark ? 'noborder_dark' : 'noborder_light')
</script>

<template>
  <client-only>
    <div v-if="valid" class="pt-8">
      <v-divider class="my-8" />
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
        loading="eager" />
    </div>
  </client-only>
</template>

<style scoped>

</style>
