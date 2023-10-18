<script setup>
import { computed } from 'vue'

const settingStore = useSettingStore()
const route = useRoute()

/// region 搜索
const queryKeyword = computed(() => route.query.keyword ?? '')
const queryPage = computed({
  get: () => +(route.query.page ?? 1),
  set: (val) => {
    if (val) navigateTo(`/search?keyword=${queryKeyword.value}&page=${val}`)
    else navigateTo(`/search?keyword=${queryKeyword.value}`)
  },
})

const searchInput = ref(null)
const inputValue = ref(queryKeyword.value)
const replaceQuery = () => navigateTo(`/search?keyword=${inputValue.value}`)

const url = computed(() => `/article?keyword=${queryKeyword.value}&page=${queryPage.value - 1}&size=${settingStore.value.settings?.pageSize ?? 12}`)

const {
  data: searchData,
  pending: isSearching,
  execute: searchArticle,
  error,
} = await useAsyncData(
  `search:${queryKeyword.value}`,
  () => api({ url: url.value }),
  {
    watch: [url],
    server: false, // 由浏览器调用搜索接口
  },
)

const pageTitle = computed(() => `搜索 ${queryKeyword.value} - ${settingStore.settings?.siteTitle ?? '博客'}`)
useHead({
  title: pageTitle,
})

/// endregion 搜索

// 搜索框自动聚焦
onMounted(() => nextTick(() => searchInput.value.focus()))
</script>

<template>
  <div class="page">
    <page-head class="mb-6" title="搜索文章、标签">
      <input
        ref="searchInput" v-model="inputValue" class="w-full mb-4" type="text" placeholder="输入关键字回车搜索"
        @keydown.enter="replaceQuery()">
      <refresh-button :loading="isSearching" @refresh="searchArticle()">
      </refresh-button>
    </page-head>
    <error-alert :show="error" :text="error" />
    <article-timeline :list="searchData?.content" />
    <f-page v-model="queryPage" class="mt-4" :page-data="searchData" />
  </div>
</template>

<style scoped>

</style>
