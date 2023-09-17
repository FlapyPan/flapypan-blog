<script setup>
import { api } from '@/api'
import ArticleCardList from '@/components/ArticleCardList.vue'
import GiscusCard from '@/components/GiscusCard.vue'
import { useSettingStore } from '@/store/setting'
import { ref } from 'vue'

const settingStore = useSettingStore()

/// region 文章数据
const fetchingArticleData = ref(false)
const articleData = ref(null)
const articleDataError = ref(null)
const getArticleData = async () => {
  articleDataError.value = null
  fetchingArticleData.value = true
  try {
    articleData.value = await api('/article?&sort=updateDate,desc&size=12')
  } catch (e) {
    console.error(e)
    articleDataError.value = e.message
  } finally {
    fetchingArticleData.value = false
  }
}
getArticleData()
/// endregion 文章数据

document.title = `主页 - ${settingStore.settings?.siteTitle ?? '博客'}`

</script>

<template>
  <v-container>
    <v-img class="w-100 mt-3 rounded-lg" height="20vh" cover :src="settingStore.settings.banner"></v-img>
    <h3 class="mb-3 mt-6">最近更新</h3>
    <v-progress-linear v-show="fetchingArticleData" color="primary" indeterminate></v-progress-linear>
    <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error"></v-alert>
    <article-card-list :article-data="articleData" :pageable="false">
    </article-card-list>
    <div v-show="!fetchingArticleData" class="text-center mt-6">
      <v-btn to="/archive" color="primary">前往归档查看更多</v-btn>
    </div>
    <giscus-card></giscus-card>
  </v-container>
</template>

<style scoped>
</style>
