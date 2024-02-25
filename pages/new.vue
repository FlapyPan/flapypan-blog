<script setup>
import { useAuthStore, useSettingStore } from '~/store';

const auth = useAuthStore();
const settingStore = useSettingStore();

/// region 新文章
function onArticleSubmit(path) {
  // 添加完成自动跳转
  navigateTo(`/${path}`);
}
/// endregion 新文章

if (import.meta.browser) {
  auth.loginDialogVisible = !auth.isLogin;
}

const title = `新文章 - ${settingStore.setting.siteTitle ?? '博客'}`;
const description = `写新文章`;
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
};
useSeoMeta(meta);
</script>

<template>
  <div class="page">
    <ArticleEditor v-if="auth.isLogin" @submit="onArticleSubmit" />
    <PageHead v-else title="请登录" />
  </div>
</template>
