<script setup>
import { api } from '@/api'
import { useSettingStore } from '@/store/setting'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import colorMap from '@/utils/color-map'
import RefreshButton from '@/components/RefreshButton.vue'

const settingStore = useSettingStore()
const router = useRouter()

/// region 搜索
const queryKeyword = computed(() => router.currentRoute.value.query['keyword'] ?? '')
const queryPage = computed({
  get: () => +(router.currentRoute.value.query['page'] ?? 1),
  set: (page) => router.push(`/search?keyword=${queryKeyword.value}&page=${page}`),
})

const searchInput = ref(null)
const inputValue = ref(queryKeyword.value)
const replaceQuery = () => inputValue.value && router.push(`/search?keyword=${inputValue.value}`)

const searchData = ref({})
const isSearching = ref(false)
const searchError = ref(null)
const url = computed(() =>
  `/article?keyword=${queryKeyword.value}&page=${queryPage.value - 1}&size=12`)
const searchArticle = async () => {
  if (isSearching.value) return
  if (!queryKeyword.value) return
  document.title = `搜索 ${queryKeyword.value} - ${settingStore.settings?.siteTitle ?? '博客'}`
  searchError.value = null
  isSearching.value = true
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

// 格式化时间
const formatter = new Intl.DateTimeFormat(
  'zh-CN',
  {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/ShangHai',
  },
)
const formatDate = (s) => formatter.format(Date.parse(s) ?? Date.now())

document.title = `搜索 - ${settingStore.settings?.siteTitle ?? '博客'}`

</script>

<template>
  <v-container>
    <h2 class="my-4 d-flex align-center">
      搜索
      <refresh-button class="ml-1" :loading="isSearching" @refresh="searchArticle()"></refresh-button>
    </h2>
    <v-text-field ref="searchInput" label="搜索标题、分类、标签" variant="outlined" color="light-blue"
                  v-model="inputValue" @keydown.enter="replaceQuery()"></v-text-field>
    <v-list v-show="searchData.content?.length > 0" rounded="lg">
      <v-list-item class="ma-3 py-3" rounded="xl"
                   v-for="{title,updateDate,path,tags} in (searchData.content ?? [])" :to="`/${path}`">
        <template #title>
          <v-row dense>
            <v-col cols="12" sm="9">
              <v-row dense>
                <v-col cols="12" lg="4"><span class="mr-2">{{ title }}</span></v-col>
                <v-col align-self="stretch">
                  <div class="d-flex align-center">
                    <v-chip class="mr-1" size="small" v-for="tag in (tags ?? [])" :to="`/tag/${tag.name}`"
                            :color="colorMap(tag.name)">
                      {{ tag.name }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>{{ formatDate(updateDate) }}</v-col>
          </v-row>
        </template>
      </v-list-item>
    </v-list>
    <v-pagination size="small" :length="searchData.totalPages ?? 1" v-model="queryPage" rounded="circle">
    </v-pagination>
  </v-container>
</template>

<style scoped>

</style>
