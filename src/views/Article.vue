<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useSettingStore } from '@/store/setting'
import { api } from '@/api'
import GiscusCard from '@/components/GiscusCard.vue'
import colorMap from '@/utils/color-map'
import RefreshButton from '@/components/RefreshButton.vue'
import { MdPreview } from 'md-editor-v3'
import { useThemeStore } from '@/store/theme'

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() =>
  import('@/components/ArticleEditor.vue'),
)

const router = useRouter()
const settingStore = useSettingStore()
const themeStore = useThemeStore()

/// region 自动置顶
const top = () => {
  window.scrollTo({
    top: 0, left: 0,
    behavior: undefined,
  })
}
onMounted(top)
/// endregion 自动置顶

// 文章路径
const path = computed(() => router.currentRoute.value?.params['path'] ?? '')

/// region 文章数据
const fetchingArticleData = ref(false)
const articleData = ref(null)
const articleDataError = ref(null)
let accessCountInterval = 0
const accessCount = ref(0)
const getAccessCount = async () => {
  clearInterval(accessCountInterval)
  accessCount.value = await api(`/access/article/${articleData.value.id}`)
  accessCountInterval = setInterval(getAccessCount, 15000)
}
onBeforeUnmount(() => clearInterval(accessCountInterval))
const getArticleData = async () => {
  articleDataError.value = null
  fetchingArticleData.value = true
  try {
    articleData.value = await api(`/article/${path.value}`)
    await getAccessCount()
  } catch (e) {
    console.error(e)
    articleDataError.value = e.message
  } finally {
    setTimeout(() => fetchingArticleData.value = false, 500)
  }
}
getArticleData()
watch(path, () => {
  if (path.value === '') return
  getArticleData().then(top)
})
/// endregion 文章数据

/// 格式化时间
const formatter = new Intl.DateTimeFormat(
  'zh-CN',
  {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/ShangHai',
  },
)
const formattedCreateDate = computed(() =>
  formatter.format(new Date(articleData.value?.createDate ?? Date.now())))
const formattedUpdateDate = computed(() =>
  formatter.format(new Date(articleData.value?.updateDate ?? Date.now())))

/// region 文章删除
const deleteDialog = ref(false)
const deleting = ref(false)
const deleteError = ref(null)
const deleteArticle = async () => {
  deleting.value = true
  deleteError.value = null
  try {
    await api(`/article/${articleData.value.id}`, 'DELETE')
    await router.replace('/archive')
  } catch (e) {
    console.error(e)
    deleteError.value = e.message
  } finally {
    deleting.value = false
  }
}
/// endregion 文章删除

/// region 文章编辑
const editData = ref({})
const isEdit = ref(false)
const openEdit = () => {
  // 打开编辑器前处理标签
  editData.value = { ...articleData.value, tagNames: articleData.value.tags?.map((tag) => tag.name) ?? [] }
  isEdit.value = true
}
onBeforeRouteUpdate(() => {
  isEdit.value = false
  return true
})
// 保存文章后的回调
const onSaveArticle = (newPath) => {
  const lastPath = path.value
  // 如果没有修改路径，直接刷新
  if (lastPath === newPath) return router.go(0)
  // 修改了路径就跳转过去
  return router.replace(`/${newPath}`)
}
/// endregion 文章编辑

/// 处理网页标题
const title = computed(() => `${articleData.value?.title ?? '文章'} - ${settingStore.settings?.siteTitle ?? '博客'}`)
watch(title, (val) => document.title = val)

</script>

<template>
  <div>
    <div v-if="settingStore.isLogin && isEdit">
      <v-container>
        <v-btn @click="isEdit=false" variant="text">
          <template #prepend>
            <v-icon class="mt-1">mdi-chevron-left</v-icon>
          </template>
          取消
        </v-btn>
      </v-container>
      <article-editor :article-data="editData" @submit="onSaveArticle"></article-editor>
    </div>
    <v-container class="content" v-else>
      <h2 class="text-h4 my-6 text-center">{{ articleData?.title }}</h2>
      <div v-show="articleData?.title" class="d-flex flex-wrap justify-center mb-4">
        <p class="mx-2 text-caption">阅读: {{ accessCount }}</p>
        <div class="date text-caption d-flex flex-wrap justify-center">
          <p>创建: {{ formattedCreateDate }}</p>
          <p v-show="formattedCreateDate!==formattedUpdateDate">修改: {{ formattedUpdateDate }}</p>
        </div>
      </div>
      <v-responsive :aspect-ratio="16 / 9" class="cover-container rounded-lg">
        <v-skeleton-loader v-show="fetchingArticleData" type="image" height="100%" />
        <v-img v-show="!fetchingArticleData" :src="articleData?.cover" cover height="100%" width="100%">
          <template #error>
            <v-img height="100%" width="100%" cover :src="settingStore.settings.banner" />
          </template>
        </v-img>
      </v-responsive>
      <div class="d-flex flex-wrap mt-4 align-center" style="gap: 6px">
        <refresh-button class="ml-1" :loading="fetchingArticleData" @refresh="getArticleData()">
        </refresh-button>
        <v-chip v-for="tag in articleData?.tags || []" :to="`/tag/${tag.name}`" :color="colorMap(tag.name)">
          {{ tag.name }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn v-if="settingStore.isLogin" @click="openEdit" color="primary" size="small" variant="text">
          <v-icon>mdi-pencil</v-icon>
          编辑
        </v-btn>
        <v-dialog v-if="settingStore.isLogin" v-model="deleteDialog" width="auto">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="red" size="small" variant="text">
              <v-icon>mdi-delete</v-icon>
              删除
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              确认删除此文章 "{{ articleData.title }}" ?
            </v-card-text>
            <v-card-item v-show="deleteError">
              <v-alert rounded="lg" :text="deleteError" type="error"></v-alert>
            </v-card-item>
            <v-card-actions>
              <v-btn color="red-lighten-2" block @click="deleteArticle" :loading="deleting">确认删除</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error" />
      <v-skeleton-loader v-show="fetchingArticleData" class="mt-2" type="article" />
      <MdPreview v-if="articleData?.id > 0" class="markdown px-0"
                 editor-id="read" :modelValue="articleData?.content ?? ''" preview-theme="default"
                 codeTheme="gradient" :theme="themeStore.isDark?'dark':'light'" :noImgZoomIn="false" />
      <giscus-card v-if="!fetchingArticleData" />
    </v-container>
  </div>
</template>

<style scoped>
.markdown {
  font-family: var(--fonts-proportional) !important;
}

.content {
  max-width: 1200px;

  .date {
    gap: 4px;
  }

  .cover-container :deep(.v-skeleton-loader__image) {
    height: 100%;
  }
}
</style>
