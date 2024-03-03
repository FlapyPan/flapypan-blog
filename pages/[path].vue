<script setup lang="ts">
import { MdCatalog, MdPreview } from 'md-editor-v3'
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
const formattedCreatedAt = useDateTimeFormat(articleData.value?.createdAt)
const formattedUpdatedAt = useDateTimeFormat(articleData.value?.updatedAt)

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

function toggleDrawer() {
  rightDrawer.value = !rightDrawer.value
}

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

async function copyLink() {
  if (!navigator.clipboard) {
    const inputElement = document.createElement('input')
    inputElement.value = location.href
    inputElement.focus()
    document.execCommand('copy')
    toast.info('链接已复制到剪贴板')
    return
  }
  const result = await navigator.permissions.query({
    // @ts-expect-error 剪切板权限
    name: 'clipboard-write',
  })
  if (result.state === 'denied') {
    toast.warning('无剪贴板权限')
    return
  }
  try {
    await navigator.clipboard.writeText(location.href)
    toast.info('链接已复制到剪贴板')
  } catch (e) {
    toast.warning('无剪贴板权限')
  }
}

async function share() {
  const url = location.href
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        url,
      })
    } catch (e) {
      await copyLink()
    }
  } else {
    await copyLink()
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
  <main class="page" @contextmenu.stop.prevent="toggleDrawer">
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
      class="flex flex-wrap items-center gap-2 rounded-lg bg-red-400 px-6 py-3 text-zinc-50 dark:bg-red-700"
    >
      <Icon class="text-lg" name="mingcute:close-circle-line" />
      <span class="text-sm">{{ articleDataError }}</span>
      <span class="flex-1" />
      <Btn style="background: none;border: none;" @click="clearError({ redirect: '/' })">
        返回主页
      </Btn>
    </div>
    <template v-if="articleData?._id">
      <div ref="titleElement">
        <PageHead :title="articleData?.title" class="mx-auto text-center" />
        <div class="my-4 flex flex-wrap items-center justify-center gap-2 text-zinc-500">
          <div class="flex items-center gap-1">
            <Icon name="mingcute:document-line" />
            <span class="hidden text-sm md:inline-block print:inline-block">创建</span>
            <span class="text-sm">{{ formattedCreatedAt }}</span>
          </div>
          <div class="flex items-center gap-1 text-sm">
            <Icon name="mingcute:edit-line" />
            <span class="hidden text-sm md:inline-block print:inline-block">修改</span>
            <span class="text-sm">{{ formattedUpdatedAt }}</span>
          </div>
        </div>
        <div class="my-4 flex flex-wrap items-center justify-center gap-2">
          <div class="ml-3 flex items-center gap-1 print:hidden">
            <Icon name="mingcute:book-6-line" />
            <span class="text-sm">{{ articleData?.accessCount }}</span>
            <span class="hidden text-sm md:inline-block">次访问</span>
          </div>
          <Btn
            v-for="name in articleData?.tags || []"
            :key="name"
            :to="`/tag/${name}`"
            icon="mingcute:hashtag-line"
            text
          >
            {{ name }}
          </Btn>
        </div>
        <div
          v-if="articleData.summary || auth.isLogin"
          class="mx-auto my-6 max-w-xl rounded-xl bg-zinc-50 p-3 text-zinc-500 dark:bg-zinc-900"
        >
          <p class="text-xs leading-relaxed">
            <span class="font-bold">
              <Icon name="mingcute:notebook-line" />
              AI摘要：
            </span>
            {{ articleData?.summary ?? '无' }}
          </p>
          <p class="mt-3 flex items-center justify-between text-xs">
            <Btn v-if="auth.isLogin" :disabled="summaryLoading" @click="summary">
              {{ summaryLoading ? '生成中...' : '生成摘要' }}
            </Btn>
            <span v-else />
            <span>
              由
              <a class="underline" href="https://xinghuo.xfyun.cn/" target="_blank">
                讯飞星火认知大模型
              </a>
              生成
            </span>
          </p>
        </div>
      </div>
      <div class="flex justify-center gap-4 pb-24">
        <MdPreview
          v-if="articleData?._id"
          :model-value="articleData?.content"
          :no-img-zoom-in="false"
          :scroll-element="scrollElement"
          theme="light"
          class="flex-1"
          code-theme="gradient"
          editor-id="read"
          preview-theme="default"
        />
        <div
          v-auto-animate
          class="side themed-scrollbar sticky top-20 hidden w-64 overflow-y-auto px-4 lg:block"
        >
          <ClientOnly>
            <MdCatalog
              :offset-top="180"
              :scroll-element="scrollElement"
              :scroll-element-offset-top="60"
              editor-id="read"
            />
          </ClientOnly>
        </div>
      </div>
      <Drawer v-model="rightDrawer" location="right-bottom">
        <div
          class="themed-scrollbar max-h-[calc(100vh-4rem)] overflow-y-auto rounded-xl bg-zinc-50 border-all dark:bg-zinc-900"
        >
          <div class="sticky top-0 z-10 bg-zinc-50 p-2 dark:bg-zinc-900">
            <ul class="border-b border-zinc-300 pb-2 dark:border-zinc-700 lg:border-none lg:pb-0">
              <li>
                <button
                  :class="[$route.name === 'new' ? 'bg-secondary-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-pink-500 hover:bg-opacity-10"
                  @click="closeDrawerAnd(share)"
                >
                  <Icon class="mr-2 h-5 w-5 text-pink-400" name="mingcute:share-2-line" />
                  分享文章
                </button>
              </li>
              <li>
                <button
                  :class="[$route.name === 'new' ? 'bg-blue-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-blue-500 hover:bg-opacity-10"
                  @click="closeDrawerAnd(download)"
                >
                  <Icon class="mr-2 h-5 w-5 text-blue-400" name="mingcute:download-line" />
                  下载文章(.md)
                </button>
              </li>
              <li>
                <button
                  :class="[$route.name === 'new' ? 'bg-secondary-500 bg-opacity-10' : '']"
                  class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-orange-500 hover:bg-opacity-10"
                  @click="closeDrawerAnd(print)"
                >
                  <Icon class="mr-2 h-5 w-5 text-orange-400" name="mingcute:print-line" />
                  打印文章(.pdf)
                </button>
              </li>
              <template v-if="auth.isLogin">
                <li @click="closeDrawerAnd(changePin, !articleData?.pinned)">
                  <button
                    v-if="articleData?.pinned"
                    class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-10"
                  >
                    <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:pin-fill" />
                    取消固定
                  </button>
                  <button
                    v-else
                    class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-10"
                  >
                    <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:pin-line" />
                    固定文章
                  </button>
                </li>
                <li @click="closeDrawerAnd(openEdit)">
                  <button
                    class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-primary-500 hover:bg-opacity-10"
                  >
                    <Icon class="mr-2 h-5 w-5 text-primary-400" name="mingcute:edit-line" />
                    编辑文章
                  </button>
                </li>
                <li @click="closeDrawerAnd(() => (deleteDialog = true))">
                  <button
                    class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-red-500 hover:bg-opacity-10"
                  >
                    <Icon class="mr-2 h-5 w-5 text-red-400" name="mingcute:delete-line" />
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
              </template>
            </ul>
          </div>
          <MdCatalog
            class="block p-2 lg:hidden"
            :offset-top="180"
            :scroll-element="scrollElement"
            :scroll-element-offset-top="60"
            editor-id="read"
          />
        </div>
      </Drawer>
      <ClientOnly>
        <div class="fixed bottom-14 right-4 z-10 md:right-12 print:hidden">
          <div class="flex flex-col justify-end gap-2 h-36">
            <button
              v-if="!atTop"
              v-auto-animate
              class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 border-all dark:bg-zinc-900 hover:text-primary-500"
              title="回到顶部"
              @click="toTop()"
            >
              <Icon name="mingcute:arrows-up-line" />
            </button>
            <button
              v-if="!atComments"
              v-auto-animate
              class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 border-all dark:bg-zinc-900 hover:text-primary-500"
              title="评论区"
              @click="toComments()"
            >
              <Icon name="mingcute:comment-line" />
            </button>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-primary-500 border-all dark:bg-zinc-900"
              title="更多"
              @click="rightDrawer = true"
            >
              <Icon name="mingcute:more-1-line" />
            </button>
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
.side {
  height: calc(100vh - 8rem);

  :deep(.md-editor-catalog) {
    @apply h-full;
  }
}
</style>
