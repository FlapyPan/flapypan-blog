<script setup>
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const props = defineProps({
  articleData: {
    type: Object,
    default: () => ({
      _id: 0,
      title: '',
      path: '',
      cover: '',
      content: '',
      tags: [],
    }),
  },
})
const emits = defineEmits(['submit'])

// 判断是否是新文章
const isNewArticle = !props.articleData?._id

/// region 文章编辑持久化
const storageKey = isNewArticle ? 'draft_new' : `draft_id_${props.articleData._id}`

// 编辑的草稿存放在 LocalStorage
function loadDraft() {
  const storageData = localStorage.getItem(storageKey)
  if (storageData) {
    // eslint-disable-next-line no-alert
    if (window.confirm('读取到上次编辑的内容，是否继续？')) return JSON.parse(storageData)
  }
  return props.articleData
}

const draft = ref(loadDraft())
const draftPersistInterval = setInterval(() => {
  localStorage.setItem(storageKey, JSON.stringify(draft.value))
}, 1000)
onBeforeUnmount(() => clearInterval(draftPersistInterval))
const editTags = computed({
  get: () => draft.value?.tags?.join(' '),
  set: (val) => draft.value.tags = [...new Set(val.split(' '))],
})
/// endregion 文章编辑持久化

// 编辑器相关错误信息
const editorError = ref(null)
const catchEditorError = ({ message }) => editorError.value = message

/// region 图片上传
// 图片压缩
async function compress(file) {
  return new Promise((resolve, reject) => {
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
}

async function onUploadImg(files, cb) {
  const res = []
  try {
    for (const file of files) {
      const form = new FormData()
      const compressFile = await compress(file)
      form.append('file', compressFile, compressFile.name)
      // 上传获取图片id
      const _id = await api({ url: '/picture', method: 'POST', payload: form, jsonPayload: false })
      res.push(`/api/picture/${_id}`)
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

async function saveArticle() {
  saveError.value = null
  saving.value = true
  const method = isNewArticle ? 'POST' : 'PUT'
  try {
    const { path } = await api({ url: `/article`, method, payload: draft.value })
    setTimeout(() => localStorage.removeItem(storageKey), 3000)
    // 将文章路径传递给父组件
    emits('submit', path)
  } catch (e) {
    saveError.value = e.message
  } finally {
    saving.value = false
  }
}

/// endregion 文章保存

const { isDark } = useDark()
</script>

<template>
  <form class="flex flex-col items-center gap-6" @submit.prevent.stop>
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <label class="text-sm flex flex-wrap items-center gap-4">
        <span>文章标题</span>
        <input
          v-model="draft.title" :disabled="saving" class="flex-1" name="title" placeholder="文章标题" required
          type="text">
      </label>
      <label class="text-sm flex flex-wrap items-center gap-4">
        <span>访问路径</span>
        <input
          v-model="draft.path" :disabled="saving" class="flex-1" name="path" placeholder="访问路径" required
          type="text">
      </label>
      <label class="text-sm flex flex-wrap items-center gap-4">
        <span>封面链接</span>
        <input
          v-model="draft.cover" :disabled="saving" class="flex-1" name="cover" placeholder="封面链接" required
          type="text">
      </label>
      <label class="text-sm flex flex-wrap items-center gap-4">
        <span>标签(空格分隔)</span>
        <input
          v-model="editTags" :disabled="saving" class="flex-1" name="tags" placeholder="标签(空格分隔)" required
          type="text">
      </label>
    </div>
    <error-alert :show="editorError" :text="editorError" />
    <MdEditor
      v-model="draft.content" :no-img-zoom-in="false" :theme="isDark ? 'dark' : 'light'" code-theme="gradient"
      editor-id="edit" preview-theme="default" @on-upload-img="onUploadImg"
      @on-error="catchEditorError" />
    <error-alert :show="saveError" :text="saveError" />
    <f-btn :disabled="saving" class="w-full max-w-xl" @click="saveArticle">
      保存发布
    </f-btn>
  </form>
</template>

<style scoped>
</style>
