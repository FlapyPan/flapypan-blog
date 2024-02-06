<script setup>
const settingStore = useSettingStore();

/// region 标签数据
const { pending: fetchingTagList, data: tagList } = await useAsyncData(`tag`, () => api(`/tag`), {
  deep: false,
});
/// endregion 标签数据

/// region 文章列表
const { pending: fetchingArticleData, data: articleData } = await useAsyncData(
  `article:yearly`,
  () =>
    api(`/article`).then((articleList) => {
      const data = [];
      let i = -1;
      let lastYear = 0;
      for (const article of articleList) {
        const year = new Date(article.createdAt).getFullYear();
        if (year !== lastYear) {
          data.push({ year, list: [] });
          i += 1;
        }
        lastYear = year;
        data[i].list.push(article);
      }
      return data;
    }),
  { deep: false },
);
/// endregion 文章列表

const title = `归档 - ${settingStore.value.siteTitle ?? '博客'}`;
const description = `我的所有文章`;
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
};
useServerSeoMeta(meta);
useSeoMeta(meta);
</script>

<template>
  <div class="page">
    <page-head sub-title="看看我都水了什么文章" title="文章归档" />
    <h3 class="my-3 flex items-center text-2xl">标签</h3>
    <div class="my-6 flex flex-wrap items-center gap-4">
      <template v-for="name in tagList" :key="name">
        <f-btn :to="`/tag/${name}`" icon="mingcute:hashtag-line" text>
          {{ name }}
        </f-btn>
      </template>
    </div>
    <div class="my-12">
      <template v-for="{ year, list } in articleData ?? []" :key="year">
        <h3 class="my-3 text-2xl">
          {{ year }}
        </h3>
        <article-timeline :list="list" />
      </template>
    </div>
    <p
      v-show="fetchingArticleData || fetchingTagList"
      class="py-2 text-center text-sm text-zinc-500">
      加载中...
    </p>
  </div>
</template>
