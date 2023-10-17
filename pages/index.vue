<script setup>
const settingStore = useSettingStore()

/// region 文章数据
const {
  pending: fetchingArticleData,
  data: articleData,
  error: articleDataError,
  refresh,
} = await useAsyncData('article:latest', () => api({ url: '/article?&sort=updateDate,desc&size=12' }))
/// endregion 文章数据

useHead({
  title: `主页 - ${settingStore.value.settings?.siteTitle ?? '博客'}`,
})
</script>

<template>
  <div>
    <section
      class="hero w-full mx-auto flex gap-16 sm:gap-32 lg:gap-64 flex-col-reverse items-center justify-center md:flex-row text-center md:text-left">
      <div>
        <h1
          class="font-serif tracking-wide text-3xl font-bold drop-shadow-lg text-zinc-700 dark:text-zinc-100 sm:text-5xl">
          {{ settingStore.settings.siteTitle }}
        </h1>
        <p class="mt-12 text-base text-zinc-600 dark:text-zinc-400">
          {{ settingStore.settings.info }}
          <span class="animate-ping">_</span>
          <!--          {{ settingStore.settings.banner }} -->
        </p>
      </div>
      <img class="w-40 h-40 rounded-full shadow-md md:w-64 md:h-64" :src="settingStore.settings?.avatar" alt="头像">
    </section>
    <section class="max-w-5xl mx-auto">
      <h3 class="mb-3 mt-6 flex items-center">
        最近更新
        <refresh-button class="ml-2" :loading="fetchingArticleData" @refresh="refresh()" />
      </h3>
      <error-alert :text="articleDataError" :show="articleDataError" />
      <div class="columns-1 md:columns-2 gap-6 space-y-6">
        <article-card v-for="a in articleData?.content ?? []" :key="a.id" :article="a" />
      </div>
      <div v-once class="text-center mt-6">
        <f-btn to="/archive" text>
          查看更多
        </f-btn>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  height: 75vh;
}
</style>
