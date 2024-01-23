<script setup>
const settingStore = useSettingStore()

/// region 标签数据
const {
  pending: fetchingTagList,
  data: tagList,
} = await useAsyncData(`tag`, () => api(`/tag`))
/// endregion 标签数据

/// region 文章列表
const {
  pending: fetchingArticleData,
  data: articleData,
} = await useAsyncData(
  `article:yearly`,
  () => api(`/article`).then((articleList) => {
    const data = []
    let i = -1
    let lastYear = 0
    for (const article of articleList) {
      const year = new Date(article.createdAt).getFullYear()
      if (year !== lastYear) {
        data.push({ year, list: [] })
        i += 1
      }
      lastYear = year
      data[i].list.push(article)
    }
    return data
  }),
)
/// endregion 文章列表

const title = `归档 - ${settingStore.value.siteTitle ?? '博客'}`
const description = `我的所有文章`
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
    <page-head
      sub-title="看看我都水了什么文章"
      title="文章归档" />
    <h3 class="text-2xl my-3 flex items-center">
      标签
    </h3>
    <div class="flex items-center gap-4 flex-wrap my-6">
      <template v-for="name in tagList" :key="name">
        <f-btn :to="`/tag/${name}`" icon="mingcute:tag-line" text>
          {{ name }}
        </f-btn>
      </template>
    </div>
    <div class="my-12">
      <template v-for="{ year, list } in (articleData ?? [])" :key="year">
        <h3 class="my-3 text-2xl">
          {{ year }}
        </h3>
        <article-timeline :list="list" />
      </template>
    </div>
    <p v-show="fetchingArticleData || fetchingTagList" class="text-center text-zinc-500 text-sm py-2">
      加载中...
    </p>
  </div>
</template>

<style scoped>
</style>
