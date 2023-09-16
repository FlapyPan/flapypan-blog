<script setup>
import { computed, ref } from 'vue'
import { api, API_URL } from '@/api'
import { MdEditor } from 'md-editor-v3'
import { useThemeStore } from '@/store/theme'
import 'https://cdn.staticfile.org/compressorjs/1.2.1/compressor.min.js'

const props = defineProps({
  articleData: { type: Object },
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
  return computed({
    get: () => {
      let storageValue = localStorage.getItem(storageKey)
      if (storageValue == null) {
        localStorage.setItem(storageKey, JSON.stringify(props.articleData ?? {
          title: '',
          path: '',
          cover: '',
          content: '',
          tagNames: [],
        }))
        storageValue = localStorage.getItem(storageKey)
      }
      return JSON.parse(storageValue)
    },
    set: (val) => {
      localStorage.setItem(storageKey, JSON.stringify(val ?? {
        title: '',
        path: '',
        cover: '',
        content: '',
        tagNames: [],
      }))
    },
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

// 编辑器相关错误信息
const editorError = ref(null)
const catchEditorError = ({ message }) => editorError.value = message

/// region 图片上传
// 图片压缩
const compress = async (file) => new Promise((resolve, reject) => {
  if (file.type === 'image/gif') {
    // Compressor.js 目前不支持 gif 压缩，暂时跳过
    resolve(file)
    return
  }
  new Compressor(file, {
    quality: 0.6, // 压缩率，针对 jpg 和 webp
    maxWidth: 1920, // 最大宽度
    maxHeight: 1080, // 最大高度
    success: resolve,
    error: reject,
  })
})
const onUploadImg = async (files, cb) => {
  const res = []
  try {
    for (const file of files) {
      const form = new FormData()
      const compressFile = await compress(file)
      form.append('file', compressFile, compressFile.name)
      // 上传获取路径
      const path = await api('/upload', 'POST', form, false)
      res.push(`${API_URL}${path}`)
    }
  } catch (e) {
    editorError.value = e.message
    console.error(e)
  }
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
    <v-container v-if="editorError">
      <v-alert rounded="lg" :text="editorError" type="error"></v-alert>
    </v-container>
    <MdEditor editor-id="edit" v-model="draft.content" @onUploadImg="onUploadImg" @onError="catchEditorError"
              preview-theme="default" codeTheme="gradient" :theme="themeStore.isDark?'dark':'light'"
              :noImgZoomIn="false" />
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
