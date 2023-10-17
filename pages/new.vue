<script setup>
const setting = useSettingStore()

/// region 新文章
function onArticleSubmit(path) {
  // 添加完成自动跳转
  navigateTo(`/${path}`)
}

/// endregion 新文章

onMounted(() => {
  if (!setting.value.isLogin) setting.value.loginDialogVisible = true
})
</script>

<template>
  <div class="page">
    <client-only>
      <article-editor v-if="setting.isLogin" @submit="onArticleSubmit" />
      <page-head v-else title="请登录" />
    </client-only>
  </div>
</template>

<style scoped>
</style>
