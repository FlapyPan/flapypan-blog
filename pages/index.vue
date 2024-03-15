<script setup lang="ts">
import { useIntervalFn, useParallax } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import type { AccessData, ArticleWithoutContent } from '~/types/api'
import { useSettingStore } from '~/store'

const settingStore = useSettingStore()

const heroElement = shallowRef<HTMLDivElement>()
const { tilt, roll, source } = useParallax(heroElement)
const heroEleStyle = computed<CSSProperties>(() => {
  const isOrientation = source.value === 'deviceOrientation'
  const x = isOrientation ? roll.value * -20 : roll.value * 10
  const y = isOrientation ? tilt.value * -20 : tilt.value * 10
  return {
    transform: `rotateX(${x}deg) rotateY(${y}deg)`,
  } satisfies CSSProperties
})

/// region 阅读量和其他数据
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

async function fetchHitokoto() {
  try {
    const { hitokoto: text, from } = await $fetch<Record<string, unknown>>(
      'https://v1.hitokoto.cn?c=a&c=c&c=d&c=j&c=k',
    )
    hitoko.value = `${text} —— ${from}`
  } catch (e) {
    console.error(e)
    hitoko.value = settingStore.setting.info
  }
}

const { pause: pauseFetchHitokoto, resume: resumeFetchHitokoto } = useIntervalFn(fetchHitokoto, 20000)
onMounted(() => watch(() => settingStore.setting.hitoko, (value) => {
  if (value) {
    if (!hitoko.value) {
      fetchHitokoto().then(resumeFetchHitokoto)
    } else {
      resumeFetchHitokoto()
    }
  } else {
    pauseFetchHitokoto()
  }
}, { immediate: true }))
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
    <section
      ref="heroElement"
      style="perspective: 200px"
      class="flex h-screen w-full items-center justify-center p-12"
    >
      <div
        :style="heroEleStyle"
        class="flex flex-col-reverse items-center justify-center gap-16 text-center will-change-transform md:flex-row md:text-left lg:gap-52"
      >
        <div>
          <h1 class="text-3xl text-stone-700 dark:text-stone-100 sm:text-4xl lg:text-5xl">
            {{ settingStore.setting.siteTitle }}
          </h1>
          <div class="text-stone-600 dark:text-stone-400">
            <p class="mt-6 flex items-center justify-center gap-4 text-2xl md:justify-start md:gap-2">
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
            <div v-if="settingStore.setting.hitoko" class="mt-4 text-center md:w-72 md:text-left">
              <p v-if="hitoko">
                {{ hitoko }}
              </p>
              <p v-else>
                加载中...
              </p>
            </div>
            <p v-else class="mt-4 text-center md:text-left">
              {{ settingStore.setting.info }}
              <span class="animate-ping">_</span>
            </p>
          </div>
        </div>
        <img
          :src="settingStore.setting.avatar"
          alt=""
          class="size-32 rounded-full md:size-40 lg:size-52"
        >
      </div>
    </section>
    <section class="page">
      <h3 class="flex items-center">
        最近更新
        <RefreshButton :loading="pending" class="ml-2" @refresh="getArticleData()" />
      </h3>
      <div v-auto-animate class="mt-8 flex flex-col gap-8">
        <div v-if="pending" class="text-center text-stone-500">
          加载中...
        </div>
        <template v-for="a in articleData ?? []" :key="a._id">
          <ArticleCard :article="a" />
        </template>
      </div>
      <div v-once class="mt-8 text-center">
        <Btn icon="mingcute:more-2-line" secondary to="/archive">
          所有博客
        </Btn>
      </div>
      <GiscusCard />
    </section>
  </main>
</template>
