<script setup>
import { api } from '@/api'
import ArticleCardList from '@/components/ArticleCardList.vue'
import { useSettingStore } from '@/store/setting'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const settingStore = useSettingStore()
const router = useRouter()

/// region 搜索
const queryKeyword = computed(() => router.currentRoute.value.query['keyword'] ?? '')
const queryPage = computed({
  get: () => +(router.currentRoute.value.query['page'] ?? 1),
  set: (page) => router.push(`/search?keyword=${queryKeyword.value}&page=${page}`),
})

const searchInput = ref(null)
const inputValue = ref('')
const replaceQuery = () => inputValue.value && router.push(`/search?keyword=${inputValue.value}`)

const searchData = ref({})
const isSearching = ref(false)
const searchError = ref(null)
const url = computed(() =>
    `/article?keyword=${queryKeyword.value}&page=${queryPage.value - 1}&size=${settingStore.settings?.pageSize ?? 12}`)
const searchArticle = async () => {
  if (isSearching.value) return
  if (!queryKeyword.value) return
  document.title = `搜索 ${queryKeyword.value} - ${settingStore.settings?.siteTitle ?? '博客'}`
  searchError.value = null
  try {
    searchData.value = await api(url.value)
  } catch (e) {
    searchError.value = e
  } finally {
    isSearching.value = false
  }
}
watch(url, searchArticle)
onMounted(searchArticle)
/// endregion 搜索

// 搜索框自动聚焦
onMounted(() => nextTick(() => searchInput.value.focus()))

document.title = `搜索 - ${settingStore.settings?.siteTitle ?? '博客'}`

</script>

<template>
  <v-container>
    <h2 class="my-4 d-flex">搜索{{
        queryKeyword ? `: ${queryKeyword} (${searchData?.content?.length ?? 0}个匹配)` : ''
      }}</h2>
    <v-text-field ref="searchInput" label="搜索标题、分类、标签" variant="outlined" color="light-blue"
                  v-model="inputValue" @keydown.enter="replaceQuery()"></v-text-field>
    <article-card-list :article-data="searchData" pageable :page="queryPage" @on-page="(p)=>queryPage=p">
    </article-card-list>
  </v-container>
</template>

<style scoped>

</style>
