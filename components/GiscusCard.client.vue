<script setup>
import { useSettingStore } from '~/store';
import 'giscus';

const settingStore = useSettingStore();
// 所有设置，缺一不可
const valid = computed(
  () =>
    !!(
      settingStore.setting.giscusRepo?.trim() !== '' &&
      settingStore.setting.giscusRepoId?.trim() !== '' &&
      settingStore.setting.giscusCategory?.trim() !== '' &&
      settingStore.setting.giscusCategoryId?.trim() !== ''
    ),
);

// 主题切换
const colorMode = useColorMode();
const theme = computed(() => `noborder_${colorMode.value}`);
</script>

<template>
  <div id="giscus" class="pt-20 print:hidden">
    <slot />
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
        reactionsenabled="1" />
    </template>
    <template v-else>
      <p class="cursor-not-allowed text-center text-xs text-zinc-500">未启用评论区</p>
    </template>
  </div>
</template>
