<script setup lang="ts">
import { useSettingStore } from '~/store'
import 'giscus'

const settingStore = useSettingStore()
// 所有设置，缺一不可
const valid = computed(
  () =>
    settingStore.setting.giscusRepo?.trim() !== ''
    && settingStore.setting.giscusRepoId?.trim() !== ''
    && settingStore.setting.giscusCategory?.trim() !== ''
    && settingStore.setting.giscusCategoryId?.trim() !== '',
)

// 主题切换
const colorMode = useColorMode()
const theme = computed(() => `noborder_${colorMode.value}`)
</script>

<template>
  <div id="giscus" class="print:hidden" :class="valid ? 'pt-6' : ''" v-bind="$attrs">
    <template v-if="valid">
      <giscus-widget
        id="comments"
        :category="settingStore.setting.giscusCategory"
        :categoryid="settingStore.setting.giscusCategoryId"
        :repo="settingStore.setting.giscusRepo"
        :repoid="settingStore.setting.giscusRepoId"
        :theme="theme"
        emitmetadata="0"
        inputposition="top"
        lang="zh-CN"
        loading="eager"
        mapping="pathname"
        reactionsenabled="1"
      />
    </template>
  </div>
</template>
