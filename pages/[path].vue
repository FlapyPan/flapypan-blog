<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.vue'))

const router = useRouter()
const settingStore = useSettingStore()

const { isDark } = useDark()

/// region 自动置顶
function top() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: undefined,
  })
}

onMounted(top)
/// endregion 自动置顶

// 文章路径
const path = computed(() => router.currentRoute.value?.params.path ?? '')

/// region 文章数据
const {
  data: articleData,
  pending: fetchingArticleData,
  error: articleDataError,
  refresh: getArticleData,
} = await useAsyncData(
    `article:${path.value}`,
    () => api({ url: `/article/${path.value}` }),
    { server: true },
)

const {
  data: accessCount,
} = await useAsyncData(
    `access:article:${path.value}`,
    () => api({ url: `/access/article/${articleData.value.id}` }),
    { server: false },
)

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
const formattedCreateDate = computed(() => formatter.format(new Date(articleData.value?.createDate ?? Date.now())))
const formattedUpdateDate = computed(() => formatter.format(new Date(articleData.value?.updateDate ?? Date.now())))

/// region 文章删除
const deleteDialog = ref(false)
const deleting = ref(false)
const deleteError = ref(null)

async function deleteArticle() {
  deleting.value = true
  deleteError.value = null
  try {
    await api({ url: `/article/${articleData.value.id}`, method: 'DELETE' })
    await router.replace('/archive')
  } catch (e) {
    deleteError.value = e.message
  } finally {
    deleting.value = false
  }
}

/// endregion 文章删除

/// region 文章编辑
const editData = ref({})
const isEdit = ref(false)

function openEdit() {
  // 打开编辑器前处理标签
  editData.value = { ...articleData.value, tagNames: articleData.value.tags?.map((tag) => tag.name) ?? [] }
  isEdit.value = true
}

onBeforeRouteUpdate(() => {
  isEdit.value = false
  return true
})

// 保存文章后的回调
function onSaveArticle(newPath) {
  const lastPath = path.value
  // 如果没有修改路径，直接刷新
  if (lastPath === newPath) return router.go(0)
  // 修改了路径就跳转过去
  return router.replace(`/${newPath}`)
}

/// endregion 文章编辑

/// 处理网页标题
const title = computed(() => `${articleData.value?.title ?? '文章'} - ${settingStore.value.settings?.siteTitle ?? '博客'}`)
useHead({
  title,
})
</script>

<template>
  <div>
    <div v-if="settingStore.isLogin && isEdit">
      <v-container>
        <v-btn variant="text" @click="isEdit = false">
          <template #prepend>
            <v-icon class="mt-1">
              mdi-chevron-left
            </v-icon>
          </template>
          取消
        </v-btn>
      </v-container>
      <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
    </div>
    <v-container v-else class="content">
      <h2 class="text-h4 my-6 text-center">
        {{ articleData?.title }}
      </h2>
      <div v-show="articleData?.title" class="d-flex flex-wrap justify-center">
        <client-only>
          <p v-show="!!accessCount" class="mx-2 text-caption">
            阅读: {{ accessCount }}
          </p>
          <div class="date text-caption d-flex flex-wrap justify-center">
            <p>创建: {{ formattedCreateDate }}</p>
            <p v-show="formattedCreateDate !== formattedUpdateDate">
              修改: {{ formattedUpdateDate }}
            </p>
          </div>
        </client-only>
      </div>
      <v-responsive :aspect-ratio="16 / 9" class="rounded-lg my-8">
        <img
          class="h-100 w-100 object-cover" :src="articleData?.cover ?? settingStore.settings.banner"
          :alt="articleData?.title">
      </v-responsive>
      <div class="d-flex flex-wrap align-center" style="gap: 6px">
        <refresh-button class="ml-1" :loading="fetchingArticleData" @refresh="getArticleData()">
        </refresh-button>
        <v-chip
          v-for="tag in articleData?.tags || []" :key="tag.id" :to="`/tag/${tag.name}`"
          :color="colorMap(tag.name)">
          {{ tag.name }}
        </v-chip>
        <v-spacer></v-spacer>
        <v-btn v-if="settingStore.isLogin" color="primary" size="small" variant="text" @click="openEdit">
          <v-icon>mdi-pencil</v-icon>
          编辑
        </v-btn>
        <v-dialog v-if="settingStore.isLogin" v-model="deleteDialog" width="auto">
          <template #activator="{ props }">
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
              <v-btn color="red-lighten-2" block :loading="deleting" @click="deleteArticle">
                确认删除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error" />
      <md-preview
        v-if="articleData?.content" class="markdown px-0"
        editor-id="read" :model-value="articleData?.content ?? ''" preview-theme="default"
        code-theme="gradient" :theme="isDark ? 'dark' : 'light'" :no-img-zoom-in="false" />
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
}
</style>
