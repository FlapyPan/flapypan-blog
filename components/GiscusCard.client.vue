<script setup>
import 'giscus'

const settingStore = useSettingStore()
// 所有设置，缺一不可
const valid = computed(() => !!(
  settingStore.value.giscusRepo?.trim() !== ''
  && settingStore.value.giscusRepoId?.trim() !== ''
  && settingStore.value.giscusCategory?.trim() !== ''
  && settingStore.value.giscusCategoryId?.trim() !== ''
))

// 主题切换
const colorMode = useColorMode()
const theme = computed(() => `noborder_${colorMode.value}`)
</script>

<template>
  <div v-if="valid" class="pt-20">
    <slot />
    <giscus-widget
      id="comments"
      :category="settingStore.giscusCategory"
      :categoryid="settingStore.giscusCategoryId"
      :repo="settingStore.giscusRepo"
      :repoid="settingStore.giscusRepoId"
      :theme="theme"
      emitmetadata="0"
      inputposition="top"
      lang="zh-CN"
      loading="eager"
      mapping="pathname"
      reactionsenabled="1" />
  </div>
</template>

<style scoped>

</style>
