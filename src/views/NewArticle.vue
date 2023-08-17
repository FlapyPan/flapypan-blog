<script setup>
import ArticleEditor from '@/components/ArticleEditor.vue'
import router from '@/router'

/// region 新文章
const onArticleSubmit = (path) => {
  // 添加完成自动跳转
  router.push(`/${path}`)
}
/// endregion 新文章
</script>

<template>
  <v-container>
    <article-editor @submit="onArticleSubmit"></article-editor>
  </v-container>
</template>

<style scoped>

</style>
