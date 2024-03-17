<script setup lang="ts">
import { MdCatalog, MdPreview } from 'md-editor-v3'
import { useClipboard, useDateFormat, useShare } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { Article, ArticleDraft } from '~/types/api'
import { useAuthStore, useSettingStore } from '~/store'
import 'md-editor-v3/lib/preview.css'

const route = useRoute()
const auth = useAuthStore()
const settingStore = useSettingStore()
const toast = useToast()

// 文章路径
const path = computed(() => route.params.path ?? '')

const scrollElement = shallowRef<HTMLElement>()
if (import.meta.browser) scrollElement.value = document.documentElement

/// region 文章数据
const {
  data: articleData,
  error: articleDataError,
  refresh: getArticleData,
} = await useAsyncData(
  `article:${path.value}`,
  () => api<Article & { accessCount?: number }>(`/article/${path.value}`),
  {
    deep: false,
    watch: [path],
  },
)

// 格式化时间
const formattedCreatedAt = useDateFormat(articleData.value?.createdAt, 'YYYY-MM-DD')
const formattedUpdatedAt = useDateFormat(articleData.value?.updatedAt, 'YYYY-MM-DD')

/// endregion

/// region 文章删除
const deleteDialog = shallowRef(false)
const deleting = shallowRef(false)

async function deleteArticle() {
  deleting.value = true
  try {
    // await api(`/article/${articleData.value._id}`, 'DELETE')
    // DELETE /api/article/[_id] 方法报 404 的临时解决方案
    await api(`/article/delete/${articleData.value?._id}`)
    await navigateTo({ path: '/archive', replace: true })
  } finally {
    deleting.value = false
  }
}

/// endregion

/// region 文章编辑
const editData = shallowRef<ArticleDraft>()
const isEdit = shallowRef(false)

function openEdit() {
  editData.value = { ...articleData.value! }
  isEdit.value = true
}

onBeforeRouteUpdate(() => {
  isEdit.value = false
  return true
})

// 保存文章后的回调
function onSaveArticle(newPath: string) {
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

async function changePin(pinned: boolean) {
  await api(`/article`, 'PUT', { _id: articleData.value?._id, pinned })
  await refreshNuxtData('pinnedLinks')
  await getArticleData()
}

/// endregion

/// region 文章摘要生成

const summaryLoading = shallowRef(false)
async function summary() {
  summaryLoading.value = true
  try {
    await api(`/ai/summary`, 'POST', { _id: articleData.value?._id })
    await getArticleData()
  } finally {
    summaryLoading.value = false
  }
}

/// endregion

/// region 浮动按钮和抽屉

const rightDrawer = shallowRef(false)

function closeDrawerAnd(f: Function, ...args: unknown[]) {
  rightDrawer.value = false
  f(...args)
}

const titleElement = shallowRef<HTMLElement | null>(null)
const commentsElement = shallowRef<HTMLElement | null>(null)
const atTop = shallowRef(true)
const atComments = shallowRef(false)

onMounted(() => {
  if (!titleElement.value || !commentsElement.value) return
  const topIntersectionObserver = new IntersectionObserver(([entry]) => {
    atTop.value = entry.isIntersecting
  })
  topIntersectionObserver.observe(titleElement.value)
  const commentsIntersectionObserver = new IntersectionObserver(([entry]) => {
    atComments.value = entry.isIntersecting
  })
  commentsIntersectionObserver.observe(commentsElement.value)
  onUnmounted(() => {
    topIntersectionObserver.disconnect()
    commentsIntersectionObserver.disconnect()
  })
})

function toTop() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function toComments() {
  const comment = document.querySelector('#giscus') as HTMLElement
  const top = comment?.offsetTop ?? 0
  document.documentElement.scrollTo({
    top,
    behavior: 'smooth',
  })
}

async function download() {
  const { content } = await api<Article>(`/article/${path.value}`)
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${articleData.value?.title}.md`
  a.click()
  URL.revokeObjectURL(url)
  toast.info('文章已下载')
}

function print() {
  toast.info('正在打印文章...', {
    timeout: 2000,
    hideProgressBar: true,
    pauseOnHover: false,
    onClose: () => {
      if (window.print) {
        window.print()
      } else {
        document.execCommand('print', false)
      }
    },
  })
}

const { share, isSupported } = useShare()
const { copy } = useClipboard({ legacy: true })

async function shareArticle() {
  const url = location.href
  if (isSupported.value) {
    await share({
      title: document.title,
      url,
    })
  } else {
    await copy(url)
    toast.success('已复制链接')
  }
}

/// endregion

/// region 处理 seo

const siteTitle = settingStore.setting.siteTitle ?? '博客'
const title = `${articleData.value?.title ?? '文章'} - ${siteTitle}`
const description
  = articleData.value?.summary
  ?? articleData.value?.content?.substring(0, 200).replace(/(\n[\s\t]*\r*\n)/g, ' ')
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  articlePublishedTime: formattedCreatedAt,
  articleModifiedTime: formattedUpdatedAt,
}
useSeoMeta(meta)

/// endregion
</script>

<template>
  <main class="page">
    <ClientOnly>
      <Teleport to="#app-bar">
        <div class="flex h-full items-center justify-between">
          <h1 class="flex items-center gap-2 text-nowrap md:pl-2">
            <span class="text-sm font-medium md:text-base">{{ articleData?.title ?? '404' }}</span>
            <span class="hidden font-mono text-sm text-stone-500 md:inline-block">
              /{{ articleData?.path }}
            </span>
          </h1>
          <div v-if="articleData?._id" class="flex items-center gap-2 text-lg">
            <Btn icon="mingcute:print-line" secondary single @click="print" />
            <Btn icon="mingcute:download-line" secondary single @click="download" />
            <Btn icon="mingcute:share-2-line" secondary single @click="shareArticle" />
          </div>
        </div>
      </Teleport>
    </ClientOnly>
    <Drawer v-if="auth.isLogin" v-model="isEdit" location="bottom" size="100%" :closable="false">
      <div class="bg-white p-4 dark:bg-black">
        <Btn icon="mingcute:left-line" class="mb-4" @click="isEdit = false">
          关闭
        </Btn>
        <LazyArticleEditor :article-data="editData" @submit="onSaveArticle" />
      </div>
    </Drawer>
    <div
      v-if="articleDataError"
      class="flex flex-wrap items-center gap-2 rounded-lg bg-red-400 px-6 py-3 text-stone-50 dark:bg-red-700"
    >
      <Icon class="text-lg" name="mingcute:close-circle-line" />
      <span class="text-sm">{{ articleDataError }}</span>
      <span class="flex-1"></span>
      <Btn style="background: none;border: none;" @click="clearError({ redirect: '/' })">
        返回主页
      </Btn>
    </div>
    <template v-if="articleData?._id">
      <div ref="titleElement" class="card mx-auto flex flex-col overflow-hidden rounded-3xl md:flex-row">
        <img :src="articleData.cover || settingStore.setting.banner" alt="" class="aspect-video rounded-3xl md:w-1/2" />
        <div class="flex-1 p-8">
          <h1 class="text-2xl">
            {{ articleData?.title }}
          </h1>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <Btn
              v-for="name in articleData?.tags || []" :key="name" :to="`/tag/${name}`" icon="mingcute:hashtag-line"
              text
            >
              {{ name }}
            </Btn>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div class="flex items-center gap-1">
              <Icon name="mingcute:document-line" />
              <span class="print:inline-block">创建时间</span>
              <span>{{ formattedCreatedAt }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="mingcute:edit-line" />
              <span class="print:inline-block">修改时间</span>
              <span>{{ formattedUpdatedAt }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="mingcute:book-6-line" />
              <span>{{ articleData?.accessCount }}</span>
              <span>次阅读</span>
            </div>
          </div>
          <div v-if="articleData.summary || auth.isLogin" class="mt-4">
            <p class="leading-relaxed">
              <span class="font-medium">
                <Icon name="mingcute:notebook-line" />
                AI摘要：
              </span>
              {{ articleData?.summary ?? '无' }}
            </p>
            <p class="mt-3 flex items-center justify-between">
              <Btn v-if="auth.isLogin" :disabled="summaryLoading" primary @click="summary">
                {{ summaryLoading ? '生成中...' : '生成摘要' }}
              </Btn>
              <span v-else></span>
              <span class="text-sm">
                由
                <a class="underline" href="https://xinghuo.xfyun.cn/" target="_blank">
                  讯飞星火认知大模型
                </a>
                生成
              </span>
            </p>
          </div>
          <ClientOnly>
            <ul v-if="auth.isLogin" class="mt-8 flex items-center gap-2">
              <li @click="closeDrawerAnd(changePin, !articleData?.pinned)">
                <button v-if="articleData?.pinned" class="flex items-center transition hover:text-secondary-500">
                  <Icon class="mr-1 text-secondary-400" name="mingcute:pin-fill" />
                  取消固定
                </button>
                <button v-else class="flex items-center transition hover:text-secondary-500">
                  <Icon class="mr-1 text-secondary-400" name="mingcute:pin-line" />
                  固定文章
                </button>
              </li>
              <li @click="closeDrawerAnd(openEdit)">
                <button class="flex items-center transition hover:text-primary-500">
                  <Icon class="mr-1 text-primary-400" name="mingcute:edit-line" />
                  编辑文章
                </button>
              </li>
              <li @click="closeDrawerAnd(() => (deleteDialog = true))">
                <button class="flex items-center transition hover:text-red-500">
                  <Icon class="mr-1 text-red-400" name="mingcute:delete-line" />
                  删除文章
                </button>
                <Dialog v-model="deleteDialog" closable>
                  <p class="mb-4">
                    确认删除此文章 "{{ articleData?.title }}" ?
                  </p>
                  <div class="text-right">
                    <Btn class="mr-4" text @click="deleteArticle">
                      <span class="text-red-500">确认删除</span>
                    </Btn>
                    <Btn text @click="deleteDialog = false">
                      取消
                    </Btn>
                  </div>
                </Dialog>
              </li>
            </ul>
          </ClientOnly>
        </div>
      </div>
      <div class="mt-6 flex justify-center gap-4 md:mt-16">
        <MdPreview
          v-if="articleData?._id" :model-value="articleData?.content" :no-img-zoom-in="false"
          :scroll-element="scrollElement" theme="light" class="flex-1" code-theme="gradient" editor-id="read"
          preview-theme="default"
        />
        <div
          v-auto-animate
          class="themed-scrollbar sticky top-20 hidden h-[calc(100vh-8rem)] w-64 overflow-y-auto px-4 lg:block"
        >
          <ClientOnly>
            <MdCatalog
              :offset-top="180" :scroll-element="scrollElement" :scroll-element-offset-top="60"
              editor-id="read"
            />
          </ClientOnly>
        </div>
      </div>
      <Drawer v-model="rightDrawer" class="block md:hidden" location="right-bottom">
        <div class="themed-scrollbar card m-2 max-h-[calc(100vh-4rem)] overflow-y-auto rounded-xl">
          <MdCatalog
            class="p-2" :offset-top="180" :scroll-element="scrollElement" :scroll-element-offset-top="60"
            editor-id="read"
          />
        </div>
      </Drawer>
      <ClientOnly>
        <div class="fixed bottom-14 right-4 z-10 lg:right-12 print:hidden">
          <div class="flex h-36 flex-col justify-end gap-2">
            <Btn
              v-if="!atTop" v-auto-animate single icon="mingcute:arrows-up-line" title="回到顶部" primary
              @click="toTop()"
            />
            <Btn
              v-if="!atComments" v-auto-animate single title="评论区" primary icon="mingcute:comment-line"
              @click="toComments()"
            />
            <Btn class="lg:hidden" single title="更多" icon="mingcute:more-1-line" primary @click="rightDrawer = true" />
          </div>
        </div>
      </ClientOnly>
      <section ref="commentsElement">
        <GiscusCard />
      </section>
    </template>
  </main>
</template>

<style scoped lang="postcss">
</style>
