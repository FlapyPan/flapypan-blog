<script setup>
import { ref } from 'vue'
import { useSettingStore } from '@/store/setting'
import { useTitle } from '@vueuse/core'
import ArticleCard from '@/components/ArticleCard.vue'
import { api } from '@/api'
import GiscusCard from '@/components/GiscusCard.vue'

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

useTitle(`主页 - ${settingStore.settings?.siteTitle ?? '博客'}`)

</script>

<template>
  <v-container>
    <div class="position-relative mt-6" style="height: 260px;">
      <v-img class="h-100 w-100 position-absolute" style="border-radius: 24px;" cover
             :src="settingStore.settings?.banner" gradient="to right, rgba(0,0,0,0.1), rgba(0,0,0,0.1)"
      ></v-img>
      <div class="site-info">
        <v-avatar :image="settingStore.settings?.avatar" size="80"></v-avatar>
        <div class="ml-4">
          <h2 class="text-high-emphasis">{{ settingStore.settings?.name }}</h2>
          <p class="text-body-2 text-medium-emphasis">{{ settingStore.settings?.info }}</p>
          <a :href="`mailto:${settingStore.settings?.email}`"
             class=" text-body-2 text-decoration-none text-medium-emphasis">
            {{ settingStore.settings?.email }}
          </a>
        </div>
      </div>
    </div>
    <v-divider class="my-6"></v-divider>
    <h3 class="mb-3 mt-6">最近更新</h3>
    <v-progress-linear v-show="fetchingArticleData" color="primary" indeterminate></v-progress-linear>
    <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error"></v-alert>
    <v-row dense>
      <v-col v-for="a in articleData?.content ?? []" :key="a.id" cols="12" md="4">
        <article-card :article="a" />
      </v-col>
      <v-col cols="12" class="mt-2 text-center">
        <v-btn to="/archive" color="primary">前往归档查看更多</v-btn>
      </v-col>
    </v-row>
    <giscus-card></giscus-card>
  </v-container>
</template>

<style scoped>
.site-info {
  position: absolute;
  inset: 10% 4%;
  background-color: rgba(var(--v-theme-background), 0.5);
  backdrop-filter: blur(6px);
  border-radius: 24px;
  transition: transform 0.2s;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.site-info:hover {
  transform: scale(1.03);
}
</style>
