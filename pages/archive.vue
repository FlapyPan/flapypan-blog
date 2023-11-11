<script setup>
import { computed } from 'vue'

const route = useRoute()
const settingStore = useSettingStore()

/// region 搜索
const queryKeyword = computed(() => route.query.keyword ?? '')
const queryPage = computed({
  get: () => +(route.query.page ?? 1),
  set: (val) => {
    if (val) navigateTo(`/archive?keyword=${queryKeyword.value}&page=${val}`)
    else navigateTo(`/archive?keyword=${queryKeyword.value}`)
  },
})

const searchInput = ref(null)
const inputValue = ref(queryKeyword.value)
const replaceQuery = () => navigateTo(`/archive?keyword=${inputValue.value}`)

const url = computed(() => `/article?keyword=${queryKeyword.value}&page=${queryPage.value - 1}&size=${settingStore.value.settings?.pageSize ?? 12}`)

const {
  data: searchData,
  pending: isSearching,
  execute: searchArticle,
  error: searchError,
} = await useAsyncData(
  `search:${queryKeyword.value}`,
  () => {
    if (!queryKeyword.value) return {}
    return api({ url: url.value })
  },
  { watch: [url] },
)
/// endregion 搜索

/// region 标签数据
const {
  pending: fetchingTagList,
  data: tagList,
  error: tagListError,
  execute: getTagList,
} = await useAsyncData(`tag`, () => api({ url: `/tag` }))
/// endregion 标签数据

/// region 文章列表
const {
  pending: fetchingArticleData,
  data: articleData,
  error: articleDataError,
  execute: getArticleData,
} = await useAsyncData(`article:yearly`, () => api({ url: `/article/group-by/year` }))
/// endregion 文章列表

/// region 标签添加
const showTagEditor = ref(false)
const newTagName = ref('')
const addingTag = ref(false)
const addTagError = ref(null)

async function addTag() {
  addTagError.value = null
  addingTag.value = true
  const { error } = await useAsyncData(
    `tag:add:${newTagName.value}`,
    () => api({ url: `/tag`, method: 'POST', payload: { name: newTagName.value } }),
    { server: false },
  )
  if (error.value) {
    addTagError.value = error.value.message
  } else {
    // 添加后刷新数据
    await getTagList()
    showTagEditor.value = false
  }
  addingTag.value = false
}

/// endregion 标签添加

const title = `归档 - ${settingStore.value.settings.siteTitle ?? '博客'}`
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
    <div class="flex items-center gap-3 flex-wrap justify-center">
      <refresh-button v-if="queryKeyword" :loading="isSearching" @refresh="searchArticle()">
      </refresh-button>
      <refresh-button
        v-else :loading="fetchingTagList || fetchingArticleData"
        @refresh="() => { getTagList();getArticleData() }" />
      <input
        ref="searchInput" v-model="inputValue" autofocus class="w-full max-w-md" placeholder="输入关键字回车搜索"
        type="text" @keydown.enter="replaceQuery()">
    </div>
    <template v-if="queryKeyword">
      <error-alert :show="searchError" :text="searchError" />
      <article-timeline :list="searchData?.content" />
      <f-page v-model="queryPage" :page-data="searchData" class="mt-4" />
    </template>
    <template v-else>
      <h3 class="mt-6 mb-3 flex items-center">
        <span class="text-2xl">
          标签
        </span>
        <client-only>
          <template v-if="settingStore.isLogin">
            <f-btn class="ml-2" icon="mingcute-add-line" text @click="showTagEditor = true">
              添加
            </f-btn>
            <f-dialog v-model="showTagEditor" closable title="添加标签">
              <form class="mt-8 flex flex-col gap-6" @submit.prevent.stop>
                <input
                  v-model="newTagName" :disabled="addingTag" name="tagName" placeholder="标签名" required type="text">
                <f-btn :disabled="addingTag" type="submit" @click="addTag()">
                  添加
                </f-btn>
                <error-alert :show="addTagError" :text="addTagError" />
              </form>
            </f-dialog>
          </template>
        </client-only>
      </h3>
      <error-alert :show="tagListError" :text="tagListError" />
      <div class="flex items-center gap-4 flex-wrap mt-6">
        <template v-for="({ name }) in tagList" :key="name">
          <f-btn :to="`/tag/${name}`" icon="mingcute:tag-line" text>
            {{ name }}
          </f-btn>
        </template>
      </div>
      <error-alert :show="articleDataError" :text="articleDataError" />
      <div class="mt-12">
        <template v-for="{ year, list } in (articleData ?? [])" :key="year">
          <h3 class="mt-4 mb-2 text-2xl">
            {{ year }}
          </h3>
          <article-timeline :list="list" />
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
