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
  () => api({ url: `/client` }),
  { server: false },
)
/// endregion 阅读量和其他数据

/// region 随机一言
const hitoko = ref('加载中...')

async function fetchHitokoto(enable) {
  if (process.browser) {
    if (!enable) return
    try {
      const { hitokoto: text } = await $fetch('https://v1.hitokoto.cn?c=a&c=c&c=d&c=j&c=k')
      hitoko.value = text
    } catch (e) {
      console.error(e)
      hitoko.value = '加载失败...'
    }
  }
}

watch(() => settingStore.value.settings.hitoko, fetchHitokoto, { immediate: true })
/// endregion 随机一言

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
      class="w-full mx-auto pt-36 flex gap-16 sm:gap-18 lg:gap-52 flex-col-reverse items-center justify-center md:flex-row text-center md:text-left">
      <div>
        <h1
          class="font-serif tracking-wide text-3xl font-bold drop-shadow-lg text-zinc-700 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
          {{ settingStore.settings.siteTitle }}
        </h1>
        <div class="text-zinc-600 dark:text-zinc-400">
          <p
            class="text-2xl flex items-center justify-center md:justify-start gap-4 md:gap-2 mt-8">
            <a
              :href="`mailto:${settingStore.settings?.email}`" class="flex items-center"
              title="邮箱联系我">
              <icon name="mingcute:at-line" />
            </a>
            <a class="flex items-center" href="https://github.com/FlapyPan/flapypan-blog" title="查看源码">
              <icon name="mdi:github" />
            </a>
          </p>
          <p v-if="settingStore.settings.hitoko" class="mt-4 text-base text-center md:text-left">
            一言：{{ hitoko }}
          </p>
          <p v-else class="mt-4 text-base text-center md:text-left">
            {{ settingStore.settings.info }}
            <span class="animate-ping">_</span>
          </p>
          <p class="mt-4 text-xs flex items-center justify-center md:justify-start gap-3">
            <span v-if="accessData?.today">今日阅读量：{{ accessData.today }}</span>
            <span v-if="accessData?.all">总阅读量：{{ accessData.all }}</span>
          </p>
        </div>
      </div>
      <img
        :src="settingStore.settings?.avatar" alt="头像"
        class="w-32 h-32 rounded-full shadow-md md:w-40 md:h-40 lg:w-52 lg:h-52">
    </section>
    <section class="max-w-5xl mx-auto mt-24">
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
      <GiscusCard />
    </section>
    <client-only>
      <section class="text-xs text-zinc-500 mt-12 flex items-center justify-center flex-wrap gap-3">
        <span v-if="clientInfo?.clientHost">IP：{{ clientInfo.clientHost }}</span>
        <span v-if="clientInfo?.httpProto">协议：{{ clientInfo.httpProto }}</span>
        <span v-if="clientInfo?.tlsVersion">TLS版本：{{ clientInfo.tlsVersion }}</span>
        <span v-if="clientInfo?.tlsCipherSuite">TLS套件：{{ clientInfo.tlsCipherSuite }}</span>
      </section>
    </client-only>
  </div>
</template>

<style scoped>
</style>
