<script setup lang="ts">
import { useAuthStore, useSettingStore } from '~/store'

const auth = useAuthStore()
const settingStore = useSettingStore()

/// region 新文章
function onArticleSubmit(path: string) {
  // 添加完成自动跳转
  navigateTo(`/${path}`)
}
/// endregion 新文章

const title = `新文章 - ${settingStore.setting.siteTitle ?? '博客'}`
const description = `写新文章`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useSeoMeta(meta)
</script>

<template>
  <main class="page">
    <ArticleEditor v-if="auth.isLogin" @submit="onArticleSubmit" />
    <h2 v-else class="text-3xl">
      请登录
    </h2>
  </main>
</template>
