<script setup>
import { useSettingStore } from '@/store/setting'
import { computed, ref, watch } from 'vue'
import { api } from '@/api'
import { useTitle } from '@vueuse/core'

const settingStore = useSettingStore()

/// region 博客设置
const savingSettings = ref(false)
const saveSettingError = ref(null)
const saveSetting = async () => {
  saveSettingError.value = null
  savingSettings.value = true
  try {
    const data = await api('/setting', 'POST', settingStore.settings)
    settingStore.settings = {
      ...settingStore.settings,
      ...data,
    }
  } catch (e) {
    console.error(e)
    saveSettingError.value = e.message
  } finally {
    savingSettings.value = false
  }
}
/// endregion 博客设置

/// region 搜索添加文章标签
const keyword = ref('')
const page = ref(1)
const articleData = ref({})
const isFetchingArticle = ref(false)
const fetchArticleError = ref(null)
const fetchArticle = async (reset = true) => {
  if (reset) page.value = 1
  if (keyword.value.trim() === '') return
  isFetchingArticle.value = true
  try {
    articleData.value = await api(`/article?keyword=${keyword.value}&page=${page.value - 1}&size=${settingStore.settings?.pageSize ?? 12}`)
  } catch (e) {
    console.error(e)
    fetchArticleError.value = e.message
  } finally {
    isFetchingArticle.value = false
  }
}
watch(page, () => fetchArticle(false))

const addPath = (article) => {
  if (settingStore.links.find((a) => a.name === article.title)) return
  settingStore.links.push({name: article.title, url: article.path})
}

const savingLinks = ref(false)
const saveLinksError = ref(null)
const saveLinks = async () => {
  saveLinksError.value = null
  savingLinks.value = true
  try {
    settingStore.links = await api('/link', 'POST', settingStore.links)
  } catch (e) {
    console.error(e)
    saveLinksError.value = e.message
  } finally {
    savingLinks.value = false
  }
}
/// endregion 搜索添加文章

// 格式化时间
const formatDate = (s) => {
  const date = new Date(s)
  const month = `${(date.getMonth() + 1)}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hours = `${date.getHours()}`.padStart(2, '0')
  const minutes = `${date.getMinutes()}`.padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

const title = computed(() => `设置 - ${settingStore.settings?.siteTitle ?? '博客'}`)
useTitle(title)

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-alert color="primary" text="注意：只有点击对应的保存按钮后才会保存至服务器" type="info"
                 variant="tonal"></v-alert>
      </v-col>
      <v-col cols="12">
        <h2>博客设置</h2>
      </v-col>
      <v-col cols="12">
        <h3>站点信息</h3>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.siteTitle" label="站点标题"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.favicon" label="站点图标链接"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.footer" label="站点底部信息"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field type="number" v-model.trim="settingStore.settings.pageSize"
                      label="分页加载的每页数量"></v-text-field>
      </v-col>
      <v-col cols="12">
        <h3>个人信息</h3>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.avatar" label="头像链接"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.banner" label="主页Banner及文章默认封面链接"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.name" label="作者名"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.info" label="个人介绍"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model.trim="settingStore.settings.email" label="邮箱"></v-text-field>
      </v-col>
      <v-col cols="12" v-show="saveSettingError">
        <v-alert rounded="lg" :text="saveSettingError" type="error"></v-alert>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" block @click="saveSetting" :loading="savingSettings">保存博客设置</v-btn>
      </v-col>
      <v-col cols="12">
        <h2>链接设置</h2>
      </v-col>
      <v-col cols="12">
        <v-chip v-for="(selection, i) in settingStore.links" :key="selection.name" variant="tonal"
                class="mr-2" closable @click:close="settingStore.links.splice(i, 1)">
          {{ selection.name }}
        </v-chip>
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="keyword" @keydown.enter="fetchArticle"
                      hide-details label="搜索文章" single-line></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-list rounded="xl">
          <v-list-item class="ma-3" rounded="xl" v-for="article in articleData?.content ?? []"
                       @click="addPath(article)">
            <template #prepend>
              <div class="d-flex align-center">
                <span class="mr-2">{{ article.title }}</span>
                  <v-chip class="mr-1" size="small" color="primary" v-for="tag in article.tags || []"
                          :to="`/tag/${tag.name}`">
                    {{ tag.name }}
                  </v-chip>
              </div>
            </template>
            <template #append>
              <span>{{ formatDate(article.createDate) }}</span>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col v-show="articleData?.content" cols="12" class="pagination">
        <v-pagination size="small" :length="articleData?.totalPages ?? 1" v-model="page" rounded="circle">
        </v-pagination>
      </v-col>
      <v-col cols="12" v-show="saveLinksError">
        <v-alert rounded="lg" :text="saveLinksError" type="error"></v-alert>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" block @click="saveLinks" :loading="savingLinks">保存链接设置</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.pagination {
  overflow-x: auto;
}
</style>
