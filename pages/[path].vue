<script setup>
import { MdCatalog, MdPreview } from 'md-editor-v3';

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.client.vue'));

const route = useRoute();
const auth = useAuth();
const settingStore = useSettingStore();

// 文章路径
const path = computed(() => route.params.path ?? '');

const scrollElement = ref(null);
if (import.meta.browser) scrollElement.value = document.documentElement;

/// region 文章数据
const {
  data: articleData,
  error: articleDataError,
  refresh: getArticleData,
} = await useAsyncData(
  `article:${path.value}`,
  () => api(`/article/${path.value}`),
);
const coverSrc = ref(articleData.value?.article?.cover || settingStore.value.banner);
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
);
const formattedCreatedAt = computed(() => formatter.format(new Date(articleData.value?.article?.createdAt ?? Date.now())));
const formattedUpdatedAt = computed(() => formatter.format(new Date(articleData.value?.article?.updatedAt ?? Date.now())));

/// region 文章删除
const deleteDialog = ref(false);
const deleting = ref(false);
const deleteError = ref(null);

async function deleteArticle() {
  deleting.value = true;
  deleteError.value = null;
  try {
    // await api(`/article/${articleData.value.article._id}`, 'DELETE')
    // DELETE /api/article/[_id] 方法报 404 的临时解决方案
    await api(`/article/delete/${articleData.value.article._id}`);
    await navigateTo({ path: '/archive', replace: true });
  } catch (e) {
    deleteError.value = e.message;
  } finally {
    deleting.value = false;
  }
}

/// endregion 文章删除

/// region 文章编辑
const editData = ref({});
const isEdit = ref(false);

function openEdit() {
  editData.value = { ...articleData.value.article };
  isEdit.value = true;
}

onBeforeRouteUpdate(() => {
  isEdit.value = false;
  return true;
});

// 保存文章后的回调
function onSaveArticle(newPath) {
  const lastPath = path.value;
  // 如果没有修改路径，直接刷新
  if (lastPath === newPath) {
    isEdit.value = false;
    getArticleData();
    return;
  }
  // 修改了路径就跳转过去
  return navigateTo({ path: `/${newPath}`, replace: true });
}

async function changePin(pinned) {
  await api(`/article`, 'PUT', { _id: articleData.value?.article?._id, pinned });
  await refreshNuxtData('pinnedLinks');
  articleData.value.article.pinned = pinned;
}

/// endregion 文章编辑

function toTop() {
  document.documentElement.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function toComments() {
  const top = document.querySelector('#giscus')?.offsetTop ?? 0;
  document.documentElement.scrollTo({
    top,
    behavior: 'smooth',
  });
}

function print() {
  try {
    document.execCommand('print', false, null);
  } catch {
    window.print();
  }
}

/// 处理网页标题
const siteTitle = settingStore.value.siteTitle ?? '博客';
const title = `${articleData.value?.article?.title ?? '文章'} - ${siteTitle}`;
const description = articleData.value?.article?.content?.substring(0, 200).replace(/(\n[\s\t]*\r*\n)/g, ' ');
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: coverSrc,
  articlePublishedTime: formattedCreatedAt,
  articleModifiedTime: formattedUpdatedAt,
};
useServerSeoMeta(meta);
useSeoMeta(meta);
</script>

<template>
  <div class="page">
    <ClientOnly>
      <div v-if="auth.state.value.isLogin && isEdit">
        <f-btn icon="mingcute:left-line" @click="isEdit = false">
          取消
        </f-btn>
        <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
      </div>
      <template v-if="!isEdit">
        <div v-if="articleDataError"
             class="px-6 py-3 bg-red-400 dark:bg-red-700 text-zinc-50 gap-2 flex flex-wrap items-center rounded-lg">
          <Icon class="text-lg" name="mingcute:close-circle-line" />
          <span class="text-sm">{{ articleDataError }}</span>
          <span class="flex-1"></span>
          <f-btn @click="clearError({ redirect: '/' })">返回主页</f-btn>
        </div>
        <template v-if="articleData?.article?._id">
          <div class="relative aspect-video max-w-4xl mx-auto mt-4 mb-16">
            <img :src="coverSrc" alt=""
                 class="z-0 absolute h-full w-full object-cover filter blur rounded-xl opacity-80">
            <img :src="coverSrc" alt="" class="z-10 absolute h-full w-full object-cover rounded-xl">
          </div>
          <div class="my-4 flex items-center justify-center flex-wrap gap-2 text-zinc-500">
            <div class="flex items-center gap-1">
              <Icon name="mingcute:document-line" />
              <span class="hidden md:inline-block print:inline-block text-sm">创建</span>
              <span class="text-sm">{{ formattedCreatedAt }}</span>
            </div>
            <div class="flex items-center gap-1 text-sm">
              <Icon name="mingcute:edit-line" />
              <span class="hidden md:inline-block print:inline-block text-sm">修改</span>
              <span class="text-sm">{{ formattedUpdatedAt }}</span>
            </div>
          </div>
          <page-head :title="articleData?.article?.title" class="mx-auto text-center">
          </page-head>
          <div class="my-4 flex items-center justify-center flex-wrap gap-2">
            <div class="flex items-center gap-1 print:hidden ml-3">
              <Icon name="mingcute:book-6-line" />
              <span class="text-sm">{{ articleData?.accessCount }}</span>
              <span class="hidden md:inline-block text-sm">次访问</span>
            </div>
            <f-btn
              v-for="name in (articleData?.article?.tags || [])" :key="name" :to="`/tag/${name}`"
              icon="mingcute:hashtag-line" text>
              {{ name }}
            </f-btn>
          </div>
          <div class="flex gap-4 justify-center">
            <md-preview
              v-if="articleData?.article?._id" :model-value="articleData?.article?.content"
              :no-img-zoom-in="false" :scroll-element="scrollElement" :theme="$colorMode.value"
              class="flex-1" code-theme="gradient" editor-id="read" preview-theme="default" />
            <div
              class="side hidden lg:block sticky w-64 px-4 top-20 mt-16 themed-scrollbar overflow-y-auto">
              <client-only>
                <md-catalog
                  :offset-top="180" :scroll-element="scrollElement" :scroll-element-offset-top="60" editor-id="read" />
              </client-only>
            </div>
          </div>
          <nav class="my-6 flex justify-center gap-4 print:hidden">
            <f-btn v-if="articleData?.pre" :to="`/${articleData.pre}`" text title="上一篇">
              <Icon class="mr-1" name="mingcute:arrow-left-circle-line" />
              上一篇
            </f-btn>
            <f-btn v-else disabled text title="没有啦">
              <Icon class="mr-1" name="mingcute:arrow-left-circle-line" />
              上一篇
            </f-btn>
            <f-btn v-if="articleData?.next" :to="`/${articleData.next}`" text title="下一篇">
              下一篇
              <Icon class="ml-1" name="mingcute:arrow-right-circle-line" />
            </f-btn>
            <f-btn v-else disabled text title="没有啦">
              下一篇
              <Icon class="ml-1" name="mingcute:arrow-right-circle-line" />
            </f-btn>
          </nav>
          <client-only>
            <div class="z-10 fixed bottom-12 right-4 md:right-12 flex flex-col gap-2 print:hidden">
              <button class="float-btn bg-blur" title="回到顶部" @click="toTop()">
                <Icon name="mingcute:arrows-up-line" />
              </button>
              <button class="float-btn bg-blur" title="评论区" @click="toComments()">
                <Icon name="mingcute:comment-line" />
              </button>
              <button class="float-btn bg-blur" title="打印当前文档" @click="print()">
                <Icon name="mingcute:print-line" />
              </button>
              <template v-if="auth.state.value.isLogin">
                <button v-if="articleData?.article?.pinned" class="float-btn bg-blur text-primary-500" title="取消固定"
                        @click="changePin(false)">
                  <Icon name="mingcute:pin-fill" />
                </button>
                <button v-else class="float-btn bg-blur" title="固定" @click="changePin(true)">
                  <Icon name="mingcute:pin-line" />
                </button>
                <button class="float-btn bg-blur" title="编辑" @click="openEdit">
                  <Icon name="mingcute:edit-line" />
                </button>
                <button class="float-btn bg-blur" title="删除" @click="deleteDialog = true">
                  <Icon name="mingcute:delete-2-line" />
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
    </ClientOnly>
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
