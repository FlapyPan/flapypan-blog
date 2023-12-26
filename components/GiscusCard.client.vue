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
  <div id="giscus" class="pt-20">
    <slot />
    <template v-if="valid">
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
    </template>
    <template v-else>
      <p class="text-center text-zinc-500 text-xs cursor-not-allowed">未启用评论区</p>
    </template>
  </div>
</template>

<style scoped>

</style>
