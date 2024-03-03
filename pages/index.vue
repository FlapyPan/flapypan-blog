<script setup lang="ts">
import type { AccessData, ArticleWithoutContent } from '~/types/api'
import { useSettingStore } from '~/store'

const settingStore = useSettingStore()

/// region 访问量和其他数据
const { data: accessData } = await useLazyAsyncData(
  `access:base`,
  () => api<AccessData>(`/access`),
  { server: false, deep: false },
)
/// endregion

/// region 文章数据
const {
  data: articleData,
  refresh,
} = await useAsyncData('article:latest', () => api<ArticleWithoutContent[]>('/article/recent'), {
  deep: false,
})

const pending = shallowRef(false)

async function getArticleData() {
  pending.value = true
  await refresh()
  setTimeout(() => pending.value = false, 1000)
}
/// endregion 文章数据

/// region 随机一言
const hitoko = shallowRef('')

async function fetchHitokoto(enable: boolean) {
  if (import.meta.browser) {
    if (!enable) return
    try {
      const { hitokoto: text } = await $fetch<{ hitokoto: string }>(
        'https://v1.hitokoto.cn?c=a&c=c&c=d&c=j&c=k',
      )
      hitoko.value = text
    } catch (e) {
      console.error(e)
      hitoko.value = '加载失败...'
    }
  }
}

onMounted(() => watch(() => settingStore.setting.hitoko, fetchHitokoto, { immediate: true }))
/// endregion 随机一言

const title = `${settingStore.setting.name} - ${settingStore.setting.siteTitle ?? '博客'}`
const description = settingStore.setting.info ?? ''
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useSeoMeta(meta)
</script>

<template>
  <main>
    <ClientOnly>
      <Teleport to="#app-bar">
        <div class="flex items-center justify-between h-full">
          <h1 class="text-sm">
            <nuxt-link to="/" class="flex items-center gap-1">
              <img :src="settingStore.setting.avatar" alt="" class="h-6 w-6 rounded-full">
              <span>{{ settingStore.setting.siteTitle }}</span>
            </nuxt-link>
          </h1>
          <div class="flex gap-1 text-xs">
            <p v-if="accessData?.today">
              今日访问:{{ accessData?.today }}
            </p>
            <p v-if="accessData?.all">
              总访问:{{ accessData?.all }}
            </p>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
    <section
      class="sm:gap-18 flex h-screen w-full flex-col-reverse items-center justify-center gap-16 text-center md:flex-row md:text-left lg:gap-52"
    >
      <div>
        <h1 class="text-3xl text-zinc-700 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
          {{ settingStore.setting.siteTitle }}
        </h1>
        <div class="text-zinc-600 dark:text-zinc-400">
          <p class="mt-8 flex items-center justify-center gap-4 text-2xl md:justify-start md:gap-2">
            <a
              :href="`mailto:${settingStore.setting.email}`"
              class="flex items-center"
              title="邮箱联系我"
            >
              <Icon name="mingcute:at-line" />
            </a>
            <a
              :href="`https://github.com/${settingStore.setting.name}`"
              class="flex items-center"
              title="github"
            >
              <Icon name="mdi:github" />
            </a>
          </p>
          <div
            v-if="settingStore.setting.hitoko"
            v-auto-animate
            class="mt-4 text-center text-sm md:text-left"
          >
            <p v-if="hitoko">
              一言：{{ hitoko }}
            </p>
            <p v-else>
              一言加载中...
            </p>
          </div>
          <p v-else class="mt-4 text-center text-sm md:text-left">
            {{ settingStore.setting.info }}
            <span class="animate-ping">_</span>
          </p>
        </div>
      </div>
      <img
        :src="settingStore.setting.avatar"
        alt=""
        class="h-32 w-32 rounded-full md:h-40 md:w-40 lg:h-52 lg:w-52"
      >
    </section>
    <section class="page">
      <h3 class="flex items-center">
        最近更新
        <RefreshButton :loading="pending" class="ml-2" @refresh="getArticleData()" />
      </h3>
      <div v-auto-animate class="mt-8 flex flex-col gap-8">
        <div v-if="pending" class="text-zinc-500 text-sm text-center">
          加载中...
        </div>
        <template v-for="(a, i) in articleData ?? []" :key="a._id">
          <ArticleCard :article="a" />
          <hr v-if="i < (articleData?.length ?? 0) - 1">
        </template>
      </div>
      <div v-once class="mt-8 text-center">
        <Btn icon="mingcute:more-2-line" text to="/archive">
          所有博客
        </Btn>
      </div>
      <GiscusCard />
    </section>
  </main>
</template>
