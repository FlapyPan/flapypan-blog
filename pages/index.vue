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

/// region 阅读量和其他数据
const {
  data: accessData,
} = await useAsyncData(
  `access:base`,
  () => api({ url: `/access` }),
  { server: false },
)
const {
  data: clientInfo,
} = await useAsyncData(
  `client:info`,
  async () => {
    const { clientHost, httpProto, tlsVersion, tlsCipherSuite } = await api({ url: `/client` })
    return `IP：${clientHost} 协议：${httpProto} TLS版本：${tlsVersion} TLS套件：${tlsCipherSuite}`
  },
  { server: false },
)
/// endregion 阅读量和其他数据

const title = `${settingStore.value.settings.name} - ${settingStore.value.settings.siteTitle ?? '博客'}`
const description = settingStore.value.settings.info ?? ''
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useServerSeoMeta(meta)
useSeoMeta(meta)
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
        <div class="text-zinc-600 dark:text-zinc-400">
          <p class="mt-12 text-base text-center md:text-left">
            {{ settingStore.settings.info }}
            <span class="animate-ping">_</span>
          </p>
          <p
            class="text-2xl flex items-center justify-center md:justify-start gap-4 md:gap-2 mt-3">
            <a
              :href="`mailto:${settingStore.settings?.email}`" class="flex items-center"
              title="邮箱联系我">
              <icon name="mingcute:at-line" />
            </a>
            <a class="flex items-center" href="https://github.com/FlapyPan/flapypan-blog" title="查看源码">
              <icon name="mdi:github" />
            </a>
          </p>
          <client-only>
            <p class="mt-4 text-xs flex items-center justify-center md:justify-start gap-3">
              <span v-if="accessData?.today">今日访问量：{{ accessData.today }}</span>
              <span v-if="accessData?.all">总访问量：{{ accessData.all }}</span>
              <span v-if="clientInfo">{{ clientInfo }}</span>
            </p>
          </client-only>
        </div>
      </div>
      <img :src="settingStore.settings?.avatar" alt="头像" class="w-40 h-40 rounded-full shadow-md md:w-64 md:h-64">
    </section>
    <section class="max-w-5xl mx-auto">
      <h3 class="mb-3 mt-6 flex items-center">
        最近更新
        <refresh-button :loading="fetchingArticleData" class="ml-2" @refresh="refresh()" />
      </h3>
      <error-alert :show="articleDataError" :text="articleDataError" />
      <div class="columns-1 md:columns-2 gap-6 space-y-6">
        <article-card v-for="a in articleData?.content ?? []" :key="a.id" :article="a" />
      </div>
      <div v-once class="text-center mt-6">
        <f-btn text to="/archive">
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
