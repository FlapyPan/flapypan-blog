<script setup>
import { api } from '@/api'
import ArticleCardList from '@/components/ArticleCardList.vue'
import { useSettingStore } from '@/store/setting'
import { defineAsyncComponent, onActivated, onDeactivated, ref } from 'vue'
import RefreshButton from '@/components/RefreshButton.vue'

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
    setTimeout(() => fetchingArticleData.value = false, 1000)
  }
}
getArticleData()
/// endregion 文章数据

onActivated(() => window.scrollTo({ top: 0 }))

// 异步加载评论区
const GiscusCard = defineAsyncComponent(() => import('@/components/GiscusCard.vue'))
const openComment = ref(false)
// 离开页面关闭评论区
onDeactivated(() => openComment.value = false)

document.title = `主页 - ${settingStore.settings?.siteTitle ?? '博客'}`

</script>

<template>
  <v-container>
    <v-img class="w-100 mt-3 rounded-lg" height="20vh" cover :src="settingStore.settings.banner"></v-img>
    <h3 class="mb-3 mt-6 d-flex align-center">
      最近更新
      <refresh-button class="ml-1" :loading="fetchingArticleData" @refresh="getArticleData()"></refresh-button>
    </h3>
    <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error"></v-alert>
    <article-card-list :article-data="articleData" :pageable="false">
    </article-card-list>
    <div v-show="!fetchingArticleData" class="text-center mt-6">
      <v-btn to="/archive" color="primary">前往归档查看更多</v-btn>
      <v-btn class="ml-2" v-if="!openComment" @click="openComment=true" color="blue">加载主页评论</v-btn>
    </div>
    <giscus-card v-if="openComment"></giscus-card>
  </v-container>
</template>

<style scoped>
</style>
