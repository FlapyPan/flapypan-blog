<script setup>
import { api } from '@/api'
import ArticleCardList from '@/components/ArticleCardList.vue'
import { useSettingStore } from '@/store/setting'
import colorMap from '@/utils/color-map'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const settingStore = useSettingStore()

const tag = computed(() => router.currentRoute.value?.params['tag'] ?? '')

/// region 获取 tag 完整信息
const tagData = ref({})
const getTagData = async () => tagData.value = await api(`/tag/${tag.value}`)
getTagData()
/// endregion 获取 tag 完整信息

/// region 获取 tag 下的文章列表
const page = ref(1)
const articleData = ref({})
const isFetchingArticle = ref(false)
const fetchArticleError = ref(null)
const fetchArticle = async () => {
  fetchArticleError.value = null
  isFetchingArticle.value = true
  try {
    articleData.value = await api(`/tag/${tag.value}/article?page=${page.value - 1}&size=${settingStore.settings?.pageSize ?? 12}`)
  } catch (e) {
    console.error(e)
    fetchArticleError.value = e.message
  } finally {
    isFetchingArticle.value = false
  }
}
fetchArticle()
/// endregion 获取 tag 下的文章列表

/// region 编辑 tag
const editTagName = ref(tag.value)
const tagEditor = ref(false)
const isUpdatingTag = ref(false)
const updateError = ref(null)
const updateTag = async () => {
  updateError.value = null
  isUpdatingTag.value = true
  try {
    const name = await api(`/tag`, 'PUT', {
      id: tagData.value?.id,
      name: editTagName.value.trim(),
    })
    tagEditor.value = false
    return router.replace(`/tag/${name}`)
  } catch (e) {
    console.error(e)
    updateError.value = e.message
  } finally {
    isUpdatingTag.value = false
  }
}
/// endregion 编辑 tag

/// region 删除 tag
const isDeletingTag = ref(false)
const tagDeleteError = ref(null)
const tagDeleteDialog = ref(false)
const deleteTag = async () => {
  tagDeleteError.value = null
  isDeletingTag.value = true
  try {
    await api(`/tag/${tagData.value.id}`, 'DELETE')
    return router.replace('/archive')
  } catch (e) {
    console.error(e)
    tagDeleteError.value = e.message
  } finally {
    isDeletingTag.value = false
  }
}
/// endregion 删除 tag

/// region 切换 tag 时的监听
watch(tag, () => {
  if (tag.value === '') return
  getTagData().then(() => {
    editTagName.value = tag.value
    page.value = 1
    fetchArticle()
  })
})
watch(page, fetchArticle)
/// endregion 切换 tag 时的监听

const title = computed(() => `${tag.value ?? '标签'} - ${settingStore.settings?.siteTitle ?? '博客'}`)
watch(title, (val) => document.title = val)

</script>

<template>
  <v-container>
    <h2 class="my-6 d-flex align-center">
      <v-chip size="x-large" :color="colorMap(tagData?.name)">{{ tagData?.name }}</v-chip>
      <v-menu v-if="settingStore.isLogin && !fetchArticleError" v-model="tagEditor" location="end"
              :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn class="ml-2" v-bind="props" icon="mdi-pencil" size="small" variant="text" color="primary"></v-btn>
        </template>

        <v-card class="ma-2 pt-2" min-width="300" elevation="2">

          <v-card-item>
            <v-text-field label="标签名" v-model="editTagName"></v-text-field>
          </v-card-item>

          <v-card-item v-show="updateError">
            <v-alert rounded="lg" :text="updateError" type="error"></v-alert>
          </v-card-item>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-dialog v-model="tagDeleteDialog" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" color="red-lighten-2" variant="text">
                  删除标签
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  确认删除此标签 "{{ tag }}" ?
                </v-card-text>
                <v-card-item v-show="tagDeleteError">
                  <v-alert rounded="lg" :text="tagDeleteError" type="error"></v-alert>
                </v-card-item>
                <v-card-actions>
                  <v-btn color="red-lighten-2" block @click="deleteTag" :loading="isDeletingTag">确认删除</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn variant="text" :disabled="editTagName.trim()===''" @click="updateTag"
                   :loading="isUpdatingTag">
              保存
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </h2>
    <v-progress-linear v-show="isFetchingArticle" color="primary" indeterminate></v-progress-linear>
    <v-alert v-show="fetchArticleError" rounded="lg" :text="fetchArticleError" type="error"></v-alert>
    <article-card-list :article-data="articleData" pageable :page="page" @on-page="(p)=>page=p">
    </article-card-list>
  </v-container>
</template>

<style scoped>
</style>
