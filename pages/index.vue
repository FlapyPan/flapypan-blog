<script setup>
const settingStore = useSettingStore()

const latest = ref(null)

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
      class="h-screen w-full mx-auto flex gap-16 sm:gap-32 lg:gap-64 flex-col-reverse items-center justify-center md:flex-row">
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
      <img class="w-48 h-48 rounded-full shadow-md md:w-64 md:h-64" :src="settingStore.settings?.avatar" alt="头像">
    </section>
    <h3 ref="latest" class="mb-3 mt-6 d-flex align-center">
      最近更新
      <refresh-button class="ml-1" :loading="fetchingArticleData" @refresh="refresh()" />
    </h3>
    <error-alert :text="articleDataError" :show="articleDataError" />
    <ArticleCardList :article-data="articleData" :pageable="false" />
    <div v-show="!fetchingArticleData" class="text-center mt-6">
      <f-btn to="/archive" text>
        查看更多
      </f-btn>
    </div>
  </div>
</template>

<style scoped>
</style>
