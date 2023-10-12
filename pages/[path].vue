<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.vue'))

const router = useRouter()
const settingStore = useSettingStore()

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
const coverSrc = ref(articleData.value.cover || settingStore.value.settings.banner)

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
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
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
  if (lastPath === newPath) {
    isEdit.value = false
    getArticleData()
    return
  }
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
  <div class="page">
    <div v-if="settingStore.isLogin && isEdit">
      <client-only>
        <v-btn variant="text" @click="isEdit = false">
          <template #prepend>
            <v-icon class="mt-1">
              mdi-chevron-left
            </v-icon>
          </template>
          取消
        </v-btn>
        <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
      </client-only>
    </div>
    <template v-else>
      <page-head class="mx-auto text-center" :title="articleData?.title">
        <template #subTitle>
          <p class="flex items-center justify-center flex-wrap">
            <span class="mr-2">
              <icon class="text-lg" name="mingcute:document-line" />
              创建
              {{ formattedCreateDate }}
            </span>
            <span class="mr-2">
              <icon class="text-lg" name="mingcute:edit-line" />
              修改
              {{ formattedUpdateDate }}
            </span>
            <client-only>
              <span v-show="!!accessCount" class="mr-2">
                <icon class="text-lg" name="mingcute:book-6-line" />
                阅读
                {{ accessCount }}
              </span>
            </client-only>
          </p>
          <p class="mt-4 flex items-center justify-center flex-wrap gap-2">
            <template v-for="({ name }) in (articleData?.tags || [])" :key="name">
              <f-btn icon="mingcute:tag-line" :to="`/tag/${name}`" text>
                {{ name }}
              </f-btn>
            </template>
          </p>
        </template>
      </page-head>
      <img class="w-full rounded-xl mb-12 max-w-4xl max-h-96 mx-auto" :src="coverSrc" alt="">
      <div class="flex flex-wrap items-center gap-4">
        <refresh-button :loading="fetchingArticleData" @refresh="getArticleData()">
        </refresh-button>
        <span class="flex-1"></span>
        <f-btn icon="mingcute-edit-line" text @click="openEdit">
          编辑
        </f-btn>
        <f-btn icon="mingcute-delete-2-line" text @click="deleteDialog = true">
          删除
        </f-btn>
        <f-dialog v-model="deleteDialog" closable>
          <p class="mb-4">
            确认删除此文章 "{{ articleData.title }}" ?
          </p>
          <div class="text-right">
            <f-btn class="mr-4" text @click="deleteArticle">
              <span class="text-red-500">
                确认删除
              </span>
            </f-btn>
            <f-btn text @click="deleteDialog = false">
              取消
            </f-btn>
          </div>
        </f-dialog>
      </div>
      <error-alert :show="articleDataError" :text="articleDataError" />
      <md-preview
        v-if="articleData?.content" class="mt-6"
        editor-id="read" :model-value="articleData?.content" preview-theme="default"
        code-theme="gradient" :no-img-zoom-in="false" />
      <giscus-card v-if="!fetchingArticleData" />
    </template>
  </div>
</template>

<style scoped>
</style>
