<script setup lang="ts">
import type { Ref } from 'vue'
import type { ArticleWithoutContent } from '~/types/api'
import { useSettingStore } from '~/store'

const route = useRoute()
const settingStore = useSettingStore()

/// region 获取 tag 信息
const tag = computed(() => route.params.tag ?? '')
const {
  data: articleData,
  pending: fetchingData,
}: {
  data: Ref<ArticleWithoutContent[]>
  pending: Ref<boolean>
} = await useAsyncData(
  `tag:${tag.value}`,
  () => api<ArticleWithoutContent[]>(`/article/tag/${tag.value}`),
  { deep: false, watch: [tag] },
)
/// endregion 获取 tag 信息

const title = `标签: ${tag.value ?? '标签'} - ${settingStore.setting.siteTitle ?? '博客'}`
const description = `${tag.value ?? '标签'} 下的所有文章`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useSeoMeta(meta)
</script>

<template>
  <main class="page">
    <h3 class="my-3 flex items-center text-2xl">
      <Icon name="mingcute:hashtag-line" />
      {{ tag }}
    </h3>
    <ArticleTimeline :list="articleData" />
    <p v-show="fetchingData" class="py-2 text-center text-stone-500">
      加载中...
    </p>
  </main>
</template>
