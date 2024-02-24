<script setup>
import { MdCatalog, MdPreview } from 'md-editor-v3';
import { useAuthStore, useSettingStore } from '~/store';
import 'md-editor-v3/lib/style.css';

// 异步的编辑器组件
const ArticleEditor = defineAsyncComponent(() => import('@/components/ArticleEditor.client.vue'));

const route = useRoute();
const auth = useAuthStore();
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

// 格式化时间
const formattedCreatedAt = useDateTimeFormat(articleData.value?.createdAt);
const formattedUpdatedAt = useDateTimeFormat(articleData.value?.updatedAt);

/// endregion

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

/// endregion

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

/// endregion

/// region 文章摘要生成

const summaryLoading = shallowRef(false);
async function summary() {
  summaryLoading.value = true;
  try {
    await api(`/ai/summary`, 'POST', { _id: articleData.value._id });
    await getArticleData();
  } finally {
    summaryLoading.value = false;
  }
}

/// endregion

/// region 浮动按钮

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

/// endregion

/// region 处理 seo

const siteTitle = settingStore.setting.siteTitle ?? '博客';
const title = `${articleData.value?.title ?? '文章'} - ${siteTitle}`;
const description =
  articleData.value?.summary ??
  articleData.value?.content?.substring(0, 200).replace(/(\n[\s\t]*\r*\n)/g, ' ');
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

/// endregion
</script>

<template>
  <div class="page">
    <ClientOnly>
      <div v-if="auth.isLogin">
        <Drawer v-model="isEdit" location="bottom" size="100%" :closable="false">
          <div class="bg-zinc-50 dark:bg-zinc-950">
            <Btn icon="mingcute:left-line" class="mb-4" @click="isEdit = false">取消</Btn>
            <ArticleEditor :article-data="editData" @submit="onSaveArticle"></ArticleEditor>
          </div>
        </Drawer>
      </div>
      <div
        v-if="articleDataError"
        class="flex flex-wrap items-center gap-2 rounded-lg bg-red-400 px-6 py-3 text-zinc-50 dark:bg-red-700">
        <Icon class="text-lg" name="mingcute:close-circle-line" />
        <span class="text-sm">{{ articleDataError }}</span>
        <span class="flex-1"></span>
        <Btn @click="clearError({ redirect: '/' })">返回主页</Btn>
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
          <Btn
            v-for="name in articleData?.tags || []"
            :key="name"
            :to="`/tag/${name}`"
            icon="mingcute:hashtag-line"
            text>
            {{ name }}
          </Btn>
        </div>
        <div
          v-if="articleData.summary || auth.isLogin"
          class="mx-auto my-6 max-w-xl rounded-xl bg-zinc-100 p-3 text-zinc-500 dark:bg-zinc-950">
          <p class="text-xs leading-relaxed">
            <span class="font-bold">
              <Icon name="mingcute:notebook-line" />
              AI摘要：
            </span>
            {{ articleData.summary ?? '无' }}
          </p>
          <p class="mt-3 flex items-center justify-between text-xs">
            <Btn v-if="auth.isLogin" :disabled="summaryLoading" @click="summary">
              {{ summaryLoading ? '生成中...' : '生成摘要' }}
            </Btn>
            <span v-else></span>
            <span>
              由
              <a class="underline" href="https://xinghuo.xfyun.cn/" target="_blank">
                讯飞星火认知大模型
              </a>
              生成
            </span>
          </p>
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
          <Teleport to="body">
            <Transition
              enter-active-class="transition-gpu duration-200"
              enter-from-class="transform translate-x-full"
              enter-to-class="transform translate-x-0"
              leave-active-class="transition-gpu duration-200"
              leave-from-class="transform translate-x-0"
              leave-to-class="transform translate-x-full">
              <div
                v-show="settingStore.rightDrawer"
                class="safe-right-0 safe-bottom-0 fixed z-[100] max-w-full p-4 print:hidden w-56">
                <div class="rounded-xl bg-zinc-100 p-2 shadow-md dark:bg-zinc-900">
                  <div class="max-h-[30vh] themed-scrollbar overflow-y-auto">
                    <MdCatalog
                      class="block lg:hidden"
                      :offset-top="180"
                      :scroll-element="scrollElement"
                      :scroll-element-offset-top="60"
                      editor-id="read" />
                  </div>
                  <hr class="my-2 block lg:hidden" />
                  <ul class="">
                    <li>
                      <button
                        :class="[$route.name === 'new' ? 'bg-secondary-500 bg-opacity-10' : '']"
                        class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-orange-500 hover:bg-opacity-10"
                        @click="print()">
                        <Icon class="mr-2 h-5 w-5 text-orange-400" name="mingcute:print-line" />
                        打印文章
                      </button>
                    </li>
                    <template v-if="auth.isLogin">
                      <li
                        @click="
                          settingStore.rightDrawer = false;
                          changePin(!articleData?.pinned);
                        ">
                        <button
                          v-if="articleData?.pinned"
                          class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-10">
                          <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:pin-fill" />
                          取消固定
                        </button>
                        <button
                          v-else
                          class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-10">
                          <Icon class="mr-2 h-5 w-5 text-secondary-400" name="mingcute:pin-line" />
                          固定文章
                        </button>
                      </li>
                      <li
                        @click="
                          settingStore.rightDrawer = false;
                          openEdit();
                        ">
                        <button
                          class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-primary-500 hover:bg-opacity-10">
                          <Icon class="mr-2 h-5 w-5 text-primary-400" name="mingcute:edit-line" />
                          编辑文章
                        </button>
                      </li>
                      <li
                        @click="
                          settingStore.rightDrawer = false;
                          deleteDialog = true;
                        ">
                        <button
                          class="group flex w-full items-center rounded-lg p-2 text-sm hover:bg-red-500 hover:bg-opacity-10">
                          <Icon class="mr-2 h-5 w-5 text-red-400" name="mingcute:delete-line" />
                          删除文章
                        </button>
                        <Dialog v-model="deleteDialog" closable>
                          <p class="mb-4">确认删除此文章 "{{ articleData?.title }}" ?</p>
                          <div class="text-right">
                            <Btn class="mr-4" text @click="deleteArticle">
                              <span class="text-red-500"> 确认删除 </span>
                            </Btn>
                            <Btn text @click="deleteDialog = false"> 取消</Btn>
                          </div>
                        </Dialog>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </Transition>
          </Teleport>
          <div class="fixed bottom-14 right-4 z-10 flex flex-col gap-2 md:right-12 print:hidden">
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
              class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 text-primary-500 shadow dark:bg-zinc-900 sm:hover:text-primary-500"
              title="更多"
              @click="settingStore.rightDrawer = true">
              <Icon name="mingcute:more-1-line" />
            </button>
          </div>
        </client-only>
        <giscus-card />
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
