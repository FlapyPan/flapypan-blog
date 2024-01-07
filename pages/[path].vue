<script setup>
import { MdCatalog, MdPreview } from 'md-editor-v3'

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.client.vue'))

const route = useRoute()
const auth = useAuth()
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
const coverSrc = ref(articleData.value?.article?.cover || settingStore.value.banner)
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
const formattedcreatedAt = computed(() => formatter.format(new Date(articleData.value?.article?.createdAt ?? Date.now())))
const formattedupdatedAt = computed(() => formatter.format(new Date(articleData.value?.article?.updatedAt ?? Date.now())))

/// region 文章删除
const deleteDialog = ref(false)
const deleting = ref(false)
const deleteError = ref(null)

async function deleteArticle() {
  deleting.value = true
  deleteError.value = null
  try {
    // await api({ url: `/article/${articleData.value.article._id}`, method: 'DELETE' })
    // DELETE /api/article/[_id] 方法报 404 的临时解决方案
    await api({ url: `/article/delete/${articleData.value.article._id}` })
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
  editData.value = { ...articleData.value.article }
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
    return getArticleData()
  }
  // 修改了路径就跳转过去
  return navigateTo({ path: `/${newPath}`, replace: true })
}

async function changePin(pinned) {
  const data = await api({
    url: `/article/pinned`,
    method: 'PUT',
    payload: { _id: articleData.value?.article?._id, pinned },
  })
  await refreshNuxtData('pinnedLinks')
  if (data) settingStore.value.links = data
  articleData.value.article.pinned = data.pinned
}

/// endregion 文章编辑

function toTop() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function toComments() {
  const top = document.querySelector('#giscus')?.offsetTop ?? 0
  document.documentElement.scrollTo({
    top,
    behavior: 'smooth',
  })
}

/// 处理网页标题
const title = `${articleData.value?.article?.title ?? '文章'} - ${settingStore.value.siteTitle ?? '博客'}`
const meta = {
  title,
  description: title,
  ogTitle: title,
  ogDescription: title,
  ogImage: coverSrc,
  articlePublishedTime: formattedcreatedAt,
  articleModifiedTime: formattedupdatedAt,
}
useServerSeoMeta(meta)
useSeoMeta(meta)
</script>

<template>
  <div class="page">
    <div v-if="auth.state.value.isLogin && isEdit">
      <f-btn icon="mingcute:left-line" @click="isEdit = false">
        取消
      </f-btn>
      <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
    </div>
    <template v-if="!isEdit">
      <error-alert :show="articleDataError" :text="articleDataError" redirect />
      <template v-if="articleData?.article?._id">
        <page-head :title="articleData?.article?.title" class="mx-auto text-center">
        </page-head>
        <p class="flex items-center justify-center flex-wrap text-xs md:text-sm gap-2">
          <span class="flex items-center gap-1">
            <icon name="mingcute:document-line" />
            <span class="hidden md:inline-block">创建</span>
            {{ formattedcreatedAt }}
          </span>
          <span class="flex items-center gap-1">
            <icon name="mingcute:edit-line" />
            <span class="hidden md:inline-block">修改</span>
            {{ formattedupdatedAt }}
          </span>
          <span class="flex items-center gap-1">
            <icon name="mingcute:book-6-line" />
            <span class="hidden md:inline-block">阅读</span>
            {{ articleData?.accessCount }}
          </span>
        </p>
        <p class="my-4 flex items-center justify-center flex-wrap gap-2">
          <f-btn
            v-for="name in (articleData?.article?.tags || [])" :key="name" :to="`/tag/${name}`"
            icon="mingcute:tag-line" text>
            {{ name }}
          </f-btn>
        </p>
        <img :src="coverSrc" alt="" class="w-full rounded-xl mb-6 md:mb-12 max-w-4xl max-h-96 mx-auto">
        <div class="flex gap-4 justify-center mt-8">
          <md-preview
            v-if="articleData?.article?._id" :model-value="articleData?.article?.content"
            :no-img-zoom-in="false" :scroll-element="scrollElement"
            class="flex-1" code-theme="gradient" editor-id="read" preview-theme="default" />
          <div class="side hidden lg:block sticky w-64 px-4 top-20 overflow-y-auto mt-16">
            <client-only>
              <md-catalog
                :offset-top="180" :scroll-element="scrollElement" :scroll-element-offset-top="60" editor-id="read" />
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
        <client-only>
          <div class="z-10 fixed bottom-12 right-4 md:right-12 flex flex-col gap-2">
            <button class="float-btn bg-blur" title="回到顶部" @click="toTop()">
              <icon name="mingcute:arrows-up-line" />
            </button>
            <button class="float-btn bg-blur" title="评论区" @click="toComments()">
              <icon name="mingcute:comment-line" />
            </button>
            <template v-if="auth.state.value.isLogin">
              <button v-if="articleData?.article?.pinned" class="float-btn bg-blur text-primary-500" title="取消固定"
                      @click="changePin(false)">
                <icon name="mingcute:pin-fill" />
              </button>
              <button v-else class="float-btn bg-blur" title="固定" @click="changePin(true)">
                <icon name="mingcute:pin-line" />
              </button>
              <button class="float-btn bg-blur" title="编辑" @click="openEdit">
                <icon name="mingcute:edit-line" />
              </button>
              <button class="float-btn bg-blur" title="删除" @click="deleteDialog = true">
                <icon name="mingcute:delete-2-line" />
              </button>
              <f-dialog v-model="deleteDialog" closable>
                <p class="mb-4">
                  确认删除此文章 "{{ articleData?.article?.title }}" ?
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
        <giscus-card />
      </template>
    </template>
  </div>
</template>

<style scoped>
.side {
  height: calc(100vh - 8rem);

  :deep(.md-editor-catalog) {
    @apply h-full;
  }
}

.float-btn {
  @apply rounded-full h-10 w-10 flex items-center justify-center shadow sm:hover:text-primary-500;
}
</style>
