<script setup>
import { MdCatalog, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.vue'))

const route = useRoute()
const settingStore = useSettingStore()

// 文章路径
const path = computed(() => route.params.path ?? '')

const scrollElement = ref(null)
if (import.meta.browser) scrollElement.value = document.documentElement

/// region 文章数据
const {
  data: articleData,
  error: articleDataError,
  refresh: getArticleData,
} = await useAsyncData(
  `article:${path.value}`,
  () => api({ url: `/article/${path.value}` }),
)
const coverSrc = ref(articleData.value?.cover || settingStore.value.settings.banner)
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
    await navigateTo({ path: '/archive', replace: true })
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
  return navigateTo({ path: `/${newPath}`, replace: true })
}

/// endregion 文章编辑

const { isDark } = useDark()

/// 处理网页标题
const title = `${articleData.value?.title ?? '文章'} - ${settingStore.value.settings.siteTitle ?? '博客'}`
const meta = {
  title,
  description: title,
  ogTitle: title,
  ogDescription: title,
  ogImage: coverSrc,
  articlePublishedTime: formattedCreateDate,
  articleModifiedTime: formattedUpdateDate,
}
useServerSeoMeta(meta)
useSeoMeta(meta)
</script>

<template>
  <div class="page">
    <client-only>
      <div v-if="settingStore.isLogin && isEdit">
        <f-btn icon="mingcute:left-line" @click="isEdit = false">
          取消
        </f-btn>
        <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
      </div>
    </client-only>
    <template v-if="!isEdit">
      <error-alert :show="articleDataError" :text="articleDataError" redirect />
      <template v-if="articleData?.id">
        <page-head :title="articleData?.title" class="mx-auto text-center">
        </page-head>
        <p class="jump-in-500 flex items-center justify-center flex-wrap text-xs md:text-sm gap-2">
          <span class="flex items-center gap-1">
            <icon name="mingcute:document-line" />
            <span class="hidden md:inline-block">创建</span>
            {{ formattedCreateDate }}
          </span>
          <span class="flex items-center gap-1">
            <icon name="mingcute:edit-line" />
            <span class="hidden md:inline-block">修改</span>
            {{ formattedUpdateDate }}
          </span>
          <client-only>
            <span class="flex items-center gap-1">
              <icon name="mingcute:book-6-line" />
              <span class="hidden md:inline-block">阅读</span>
              {{ articleData?.accessCount }}
            </span>
          </client-only>
        </p>
        <p class="jump-in-500 my-4 flex items-center justify-center flex-wrap gap-2">
          <f-btn
            v-for="({ name }) in (articleData?.tags || [])" :key="name" :to="`/tag/${name}`"
            icon="mingcute:tag-line" text>
            {{ name }}
          </f-btn>
        </p>
        <img :src="coverSrc" alt="" class="jump-in-600 w-full rounded-xl mb-6 md:mb-12 max-w-4xl max-h-96 mx-auto">
        <client-only>
          <div class="flex flex-wrap items-center gap-4 justify-center">
            <template v-if="settingStore.isLogin">
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
            </template>
          </div>
        </client-only>
        <div class="flex gap-4">
          <md-preview
            v-if="articleData?.content" :model-value="articleData?.content"
            :no-img-zoom-in="false" :scroll-element="scrollElement"
            :theme="isDark ? 'dark' : 'light'" code-theme="gradient" editor-id="read" preview-theme="default" />
          <div class="side hidden lg:block sticky w-64 px-4 top-14 overflow-y-auto mt-16">
            <client-only>
              <md-catalog
                :offset-top="180" :scroll-element="scrollElement" :scroll-element-offset-top="60"
                :theme="isDark ? 'dark' : 'light'" editor-id="read" />
            </client-only>
          </div>
        </div>
        <nav class="my-6 flex justify-center gap-4">
          <f-btn v-if="articleData?.pre" :to="`/${articleData.pre}`" text title="上一篇">
            <icon class="mr-1" name="mingcute:arrow-left-circle-line" />
            上一篇
          </f-btn>
          <f-btn v-else disabled text title="没有啦">
            <icon class="mr-1" name="mingcute:arrow-left-circle-line" />
            上一篇
          </f-btn>
          <f-btn v-if="articleData?.next" :to="`/${articleData.next}`" text title="下一篇">
            下一篇
            <icon class="ml-1" name="mingcute:arrow-right-circle-line" />
          </f-btn>
          <f-btn v-else disabled text title="没有啦">
            下一篇
            <icon class="ml-1" name="mingcute:arrow-right-circle-line" />
          </f-btn>
        </nav>
        <giscus-card />
      </template>
    </template>
  </div>
</template>

<style scoped>
.side {
  height: calc(100vh - 7rem);
}
</style>
