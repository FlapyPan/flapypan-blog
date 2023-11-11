<script setup>
const settingStore = useSettingStore()
// 所有设置，缺一不可
const valid = computed(() => !!(
  settingStore.value.settings.giscusRepo?.trim() !== ''
  && settingStore.value.settings.giscusRepoId?.trim() !== ''
  && settingStore.value.settings.giscusCategory?.trim() !== ''
  && settingStore.value.settings.giscusCategoryId?.trim() !== ''
))

// 主题切换
const { isDark } = useDark()
const theme = computed(() => isDark.value ? 'noborder_dark' : 'noborder_light')
</script>

<template>
  <client-only>
    <div v-if="valid" class="pt-20">
      <slot />
      <giscus-widget
        id="comments"
        :category="settingStore.settings.giscusCategory"
        :categoryid="settingStore.settings.giscusCategoryId"
        :repo="settingStore.settings.giscusRepo"
        :repoid="settingStore.settings.giscusRepoId"
        :theme="theme"
        emitmetadata="0"
        inputposition="top"
        lang="zh-CN"
        loading="eager"
        mapping="pathname"
        reactionsenabled="1" />
    </div>
  </client-only>
</template>

<style scoped>

</style>
