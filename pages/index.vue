<script setup>
const settingStore = useSettingStore()

/// region 文章数据
const {
  pending: fetchingArticleData,
  data: articleData,
  refresh,
} = await useAsyncData('article:latest', () => api({ url: '/article/recent' }))
/// endregion 文章数据

/// region 随机一言
const hitoko = ref('加载中...')

async function fetchHitokoto(enable) {
  if (import.meta.browser) {
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

watch(() => settingStore.value.hitoko, fetchHitokoto, { immediate: true })
/// endregion 随机一言

const title = `${settingStore.value.name} - ${settingStore.value.siteTitle ?? '博客'}`
const description = settingStore.value.info ?? ''
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
          class="font-serif tracking-wide text-3xl font-bold text-zinc-700 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
          {{ settingStore.siteTitle }}
        </h1>
        <div class="text-zinc-600 dark:text-zinc-400">
          <p
            class="text-2xl flex items-center justify-center md:justify-start gap-4 md:gap-2 mt-8">
            <a
              :href="`mailto:${settingStore.email}`" class="flex items-center"
              title="邮箱联系我">
              <icon name="mingcute:at-line" />
            </a>
            <a :href="`https://github.com/${settingStore.name}`" class="flex items-center" title="github">
              <icon name="mdi:github" />
            </a>
          </p>
          <client-only>
            <p v-if="settingStore.hitoko" class="mt-4 text-sm text-center md:text-left">
              一言：{{ hitoko }}
            </p>
            <p v-else class="mt-4 text-sm text-center md:text-left">
              {{ settingStore.info }}
              <span class="animate-ping">_</span>
            </p>
          </client-only>
        </div>
      </div>
      <img :src="settingStore.avatar" alt="" class="w-32 h-32 rounded-full md:w-40 md:h-40 lg:w-52 lg:h-52">
    </section>
    <section class="max-w-5xl mx-auto mt-24">
      <h3 class="mb-3 mt-6 flex items-center">
        最近更新
        <refresh-button :loading="fetchingArticleData" class="ml-2" @refresh="refresh()" />
      </h3>
      <div class="columns-1 md:columns-2 gap-6 space-y-6">
        <article-card v-for="a in articleData ?? []" :key="a._id" :article="a" />
      </div>
      <div v-once class="text-center mt-6">
        <f-btn text to="/archive">
          查看更多
        </f-btn>
      </div>
      <GiscusCard />
    </section>
  </div>
</template>

<style scoped>
</style>
