<script setup>
import { MdCatalog, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.client.vue'));

const route = useRoute();
const auth = useAuth();
const settingStore = useSettingStore();

// 文章路径
const path = computed(() => route.params.path ?? '');

const scrollElement = shallowRef(null);
if (import.meta.browser) scrollElement.value = document.documentElement;

/// region 文章数据
const {
  data: articleData,
  error: articleDataError,
  refresh: getArticleData,
} = await useAsyncData(`article:${path.value}`, () => api(`/article/${path.value}`), {
  deep: false,
  watch: [path],
});
/// endregion 文章数据

/// 格式化时间
const formattedCreatedAt = useDateTimeFormat(articleData.value?.createdAt);
const formattedUpdatedAt = useDateTimeFormat(articleData.value?.updatedAt);

/// region 文章删除
const deleteDialog = shallowRef(false);
const deleting = shallowRef(false);
const deleteError = shallowRef(null);

async function deleteArticle() {
  deleting.value = true;
  deleteError.value = null;
  try {
    // await api(`/article/${articleData.value._id}`, 'DELETE')
    // DELETE /api/article/[_id] 方法报 404 的临时解决方案
    await api(`/article/delete/${articleData.value._id}`);
    await navigateTo({ path: '/archive', replace: true });
  } catch (e) {
    deleteError.value = e.message;
  } finally {
    deleting.value = false;
  }
}

/// endregion 文章删除

/// region 文章编辑
const editData = shallowRef({});
const isEdit = shallowRef(false);

function openEdit() {
  editData.value = { ...articleData.value };
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
  await api(`/article`, 'PUT', { _id: articleData.value?._id, pinned });
  await refreshNuxtData('pinnedLinks');
  await getArticleData();
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
  document.execCommand('print', false, null);
  window.print();
}

/// 处理网页标题
const siteTitle = settingStore.value.siteTitle ?? '博客';
const title = `${articleData.value?.title ?? '文章'} - ${siteTitle}`;
const description = articleData.value?.content?.substring(0, 200).replace(/(\n[\s\t]*\r*\n)/g, ' ');
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
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
        <f-btn icon="mingcute:left-line" @click="isEdit = false"> 取消</f-btn>
        <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
      </div>
      <template v-if="!isEdit">
        <div
          v-if="articleDataError"
          class="flex flex-wrap items-center gap-2 rounded-lg bg-red-400 px-6 py-3 text-zinc-50 dark:bg-red-700">
          <Icon class="text-lg" name="mingcute:close-circle-line" />
          <span class="text-sm">{{ articleDataError }}</span>
          <span class="flex-1"></span>
          <f-btn @click="clearError({ redirect: '/' })">返回主页</f-btn>
        </div>
        <template v-if="articleData?._id">
          <page-head :title="articleData?.title" class="mx-auto text-center"></page-head>
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
            <f-btn
              v-for="name in articleData?.tags || []"
              :key="name"
              :to="`/tag/${name}`"
              icon="mingcute:hashtag-line"
              text>
              {{ name }}
            </f-btn>
          </div>
          <div class="flex justify-center gap-4">
            <md-preview
              v-if="articleData?._id"
              :model-value="articleData?.content"
              :no-img-zoom-in="false"
              :scroll-element="scrollElement"
              :theme="$colorMode.value"
              class="flex-1"
              code-theme="gradient"
              editor-id="read"
              preview-theme="default" />
            <div
              class="side themed-scrollbar sticky top-20 hidden w-64 overflow-y-auto px-4 lg:block">
              <client-only>
                <md-catalog
                  :offset-top="180"
                  :scroll-element="scrollElement"
                  :scroll-element-offset-top="60"
                  editor-id="read" />
              </client-only>
            </div>
          </div>
          <client-only>
            <div class="fixed bottom-12 right-4 z-10 flex flex-col gap-2 md:right-12 print:hidden">
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                title="回到顶部"
                @click="toTop()">
                <Icon name="mingcute:arrows-up-line" />
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                title="评论区"
                @click="toComments()">
                <Icon name="mingcute:comment-line" />
              </button>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                title="打印当前文档"
                @click="print()">
                <Icon name="mingcute:print-line" />
              </button>
              <template v-if="auth.state.value.isLogin">
                <button
                  v-if="articleData?.pinned"
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-primary-500 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                  title="取消固定"
                  @click="changePin(false)">
                  <Icon name="mingcute:pin-fill" />
                </button>
                <button
                  v-else
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                  title="固定"
                  @click="changePin(true)">
                  <Icon name="mingcute:pin-line" />
                </button>
                <button
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                  title="编辑"
                  @click="openEdit">
                  <Icon name="mingcute:edit-line" />
                </button>
                <button
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
                  title="删除"
                  @click="deleteDialog = true">
                  <Icon name="mingcute:delete-2-line" />
                </button>
                <f-dialog v-model="deleteDialog" closable>
                  <p class="mb-4">确认删除此文章 "{{ articleData?.title }}" ?</p>
                  <div class="text-right">
                    <f-btn class="mr-4" text @click="deleteArticle">
                      <span class="text-red-500"> 确认删除 </span>
                    </f-btn>
                    <f-btn text @click="deleteDialog = false"> 取消</f-btn>
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
</style>
