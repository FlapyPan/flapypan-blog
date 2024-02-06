<script setup>
const settingStore = useSettingStore();

/// region 访问量和其他数据
const { data: accessData } = await useLazyAsyncData(`access:base`, () => api(`/access`), {
  server: false,
  deep: false,
});
/// endregion
</script>

<template>
  <footer class="mx-auto max-w-3xl pb-12 text-center print:hidden">
    <p class="my-8 text-center text-zinc-500">{{ settingStore.footer }}</p>
    <p class="flex justify-center gap-2 text-xs text-zinc-500">
      <span v-if="accessData?.today">今日访问量：{{ accessData.today }}</span>
      <span v-if="accessData?.all">总访问量：{{ accessData.all }}</span>
    </p>
    <p class="mt-2 text-xs text-zinc-500">
      Powered by <a href="https://github.com/FlapyPan/flapypan-blog">FlapyBlog</a>
    </p>
  </footer>
</template>
