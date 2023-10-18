<script setup>
const settingStore = useSettingStore()

/// region 新文章
function onArticleSubmit(path) {
  // 添加完成自动跳转
  navigateTo(`/${path}`)
}

/// endregion 新文章

onMounted(() => {
  if (!settingStore.value.isLogin) settingStore.value.loginDialogVisible = true
})

const title = `新文章 - ${settingStore.value.settings.siteTitle ?? '博客'}`
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
  <div class="page">
    <client-only>
      <article-editor v-if="settingStore.isLogin" @submit="onArticleSubmit" />
      <page-head v-else title="请登录" />
    </client-only>
  </div>
</template>

<style scoped>
</style>
