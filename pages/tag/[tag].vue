<script setup>
const route = useRoute()
const settingStore = useSettingStore()

/// region 获取 tag 信息
const tag = computed(() => route.params.tag ?? '')
const {
  data: articleData,
  pending: fetchingData,
  error: fetchDataError,
} = useAsyncData(
  `tag:${tag.value}`,
  async () => api({ url: `/article/tag/${tag.value}` }),
  { watch: [tag] },
)
/// endregion 获取 tag 信息

const title = `标签: ${tag.value ?? '标签'} - ${settingStore.value.siteTitle ?? '博客'}`
const description = `${tag.value ?? '标签'} 下的所有文章`
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
  <div class="page">
    <page-head class="mb-6">
      <template #title>
        <icon name="mingcute:tag-line" />
        {{ tag }}
      </template>
    </page-head>
    <error-alert :show="fetchDataError" :text="fetchDataError" redirect />
    <article-timeline :list="articleData" />
    <p v-show="fetchingData" class="text-center text-zinc-500 text-sm py-2">
      加载中...
    </p>
  </div>
</template>

<style scoped>

</style>
