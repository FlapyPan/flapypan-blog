<script setup>
import { MdPreview } from 'md-editor-v3';

const settingStore = useSettingStore();

/// region 访问量和其他数据
const {
  data: accessData,
} = await useLazyAsyncData(
  `access:base`,
  () => api(`/access`),
  { server: false, deep: false },
);
/// endregion 访问量和其他数据
</script>

<template>
  <footer class="max-w-3xl mx-auto text-center pb-12 print:hidden">
    <md-preview
      v-if="settingStore.footer" :model-value="settingStore.footer"
      :no-img-zoom-in="true" :scroll-element="null"
      :theme="$colorMode.value" code-theme="gradient" editor-id="footer" preview-theme="default" />
    <p class="text-xs text-zinc-500 flex justify-center gap-2">
      <span v-if="accessData?.today">今日访问量：{{ accessData.today }}</span>
      <span v-if="accessData?.all">总访问量：{{ accessData.all }}</span>
    </p>
    <p class="text-xs text-zinc-500 mt-2">
      Powered by <a href="https://github.com/FlapyPan/flapypan-blog">FlapyBlog</a>
    </p>
  </footer>
</template>

<style scoped>

</style>
