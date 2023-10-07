<script setup>
import { computed } from 'vue'

const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()

/// region 搜索
const queryKeyword = computed(() => route.query.keyword ?? '')
const queryPage = computed({
  get: () => +(route.query.page ?? 1),
  set: (page) => router.push(`/search?keyword=${queryKeyword.value}&page=${page}`),
})

const searchInput = ref(null)
const inputValue = ref(queryKeyword.value)
const replaceQuery = () => router.replace(`/search?keyword=${inputValue.value}`)

const url = computed(() => `/article?keyword=${queryKeyword.value}&page=${queryPage.value - 1}&size=12`)

const {
  data: searchData,
  pending: isSearching,
  execute: searchArticle,
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
  <v-container style="max-width: 1000px">
    <h2 class="my-4 d-flex align-center">
      搜索
      <refresh-button class="ml-1" :loading="isSearching" @refresh="searchArticle()"></refresh-button>
    </h2>
    <v-text-field
      ref="searchInput" v-model="inputValue" label="搜索标题、分类、标签" variant="outlined"
      color="light-blue" @keydown.enter="replaceQuery()"></v-text-field>
    <article-timeline :list="searchData?.content" />
    <v-pagination v-model="queryPage" size="small" :length="searchData?.totalPages ?? 1" rounded="circle">
    </v-pagination>
  </v-container>
</template>

<style scoped>

</style>
