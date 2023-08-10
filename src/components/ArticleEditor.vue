<script setup>
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'
import { api, API_URL } from '@/api'
import { MdEditor } from 'md-editor-v3'
import { useThemeStore } from '@/store/theme'
import 'md-editor-v3/lib/style.css'

const props = defineProps({
  articleData: {type: Object},
})

const emits = defineEmits(['submit'])

const themeStore = useThemeStore()

// 判断是否是新文章
const isNewArticle = !(props.articleData?.id > 0)

/// region 文章编辑持久化
const storageKey = isNewArticle ? 'draft_new' : `draft_id_${props.articleData.id}`
// 编辑的草稿存放在 LocalStorage
const makeDraft = () => {
  if (!isNewArticle
    && localStorage.getItem(storageKey)
    && !window.confirm('读取到上次编辑的内容，是否继续？')) {
    localStorage.removeItem(storageKey)
  }
  return useLocalStorage(storageKey, props.articleData ?? {
    title: '',
    path: '',
    cover: '',
    content: '',
    tagNames: [],
  })
}
const draft = makeDraft()
/// endregion 文章编辑持久化

/// region 标签数据
const tagData = ref([])
const getTagList = async () => {
  let tags
  try {
    tags = await api('/tag')
  } catch (e) {
    console.error(e)
    tags = []
  }
  tagData.value = tags.map((tag) => tag.name)
  // 去除无效标签
  draft.value.tagNames = draft.value.tagNames
    .filter((tagName) => tagData.value.includes(tagName))
}
getTagList()
/// endregion 标签数据

/// region 图片上传
const onUploadImg = async (files, cb) => {
  // 批量上传
  const tasks = files.map((file) => new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    api('/upload', 'POST', form, false)
      .then((path) => resolve(`${API_URL}${path}`))
      .catch(reject)
  }))
  const res = await Promise.all(tasks)
  cb(res)
}
/// endregion 图片上传

/// region 文章保存
const saving = ref(false)
const saveError = ref(null)
const saveArticle = async () => {
  saveError.value = null
  saving.value = true
  const method = isNewArticle ? 'POST' : 'PUT'
  try {
    const path = await api(`/article`, method, draft.value)
    localStorage.removeItem(storageKey)
    // 将文章路径传递给父组件
    emits('submit', path)
  } catch (e) {
    console.error(e)
    saveError.value = e.message
  } finally {
    saving.value = false
  }
}
/// endregion 文章保存

</script>

<template>
  <div>
    <v-form>
      <v-container>
        <v-alert color="primary" type="info" variant="tonal" class="mb-4"
                 text="编辑的内容会在本机自动保存，编辑完成后点击最下方发布按钮发布"></v-alert>
        <v-row dense>
          <v-col cols="6">
            <v-text-field v-model="draft.title" label="文章标题"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="draft.path" label="访问路径"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="draft.cover" label="封面链接"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="draft.tagNames" :items="tagData ?? []" label="标签"
                      variant="underlined" chips multiple>
            </v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <MdEditor editor-id="edit" v-model="draft.content" @onUploadImg="onUploadImg"
              preview-theme="default" codeTheme="gradient" :theme="themeStore.isDark?'dark':'light'" />
    <v-row class="mt-4">
      <v-col cols="12" class="px-12">
        <v-alert v-show="saveError" rounded="lg" :text="saveError" type="error"></v-alert>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn class="my-4" width="60%" max-width="500px" @click="saveArticle" color="primary" :loading="saving">发布
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
</style>
