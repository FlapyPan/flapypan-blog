<script setup>
import { MdEditor } from 'md-editor-v3'
import { useToast } from 'vue-toastification'

const props = defineProps({
  articleData: {
    type: Object,
    default: () => ({
      _id: 0,
      title: '',
      path: '',
      cover: '',
      content: '',
      tags: []
    })
  }
})
const emits = defineEmits(['submit'])

const toast = useToast()

// 判断是否是新文章
const isNewArticle = !props.articleData?._id

/// region 文章编辑持久化
const storageKey = isNewArticle
  ? 'draft_new'
  : `draft_id_${props.articleData._id}`

// 编辑的草稿存放在 LocalStorage
function loadDraft() {
  const storageData = localStorage.getItem(storageKey)
  if (storageData) {
    // eslint-disable-next-line no-alert
    if (window.confirm('读取到上次编辑的内容，是否继续？'))
      return JSON.parse(storageData)
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
  set: (val) => (draft.value.tags = [...new Set(val.split(' '))])
})
/// endregion 文章编辑持久化

const catchEditorError = ({ message }) => toast.error(message)

/// region 图片上传

async function uploadImg(file) {
  const form = new FormData()
  form.append('file', file, file.name)
  // 上传获取图片id
  const _id = await api('/picture', 'POST', form, false)
  return `/api/picture/${_id}`
}

async function onUploadImg(files, cb) {
  const res = await Promise.all(files.map(uploadImg))
  cb(res)
}

/// endregion 图片上传

/// region 文章保存
const saving = shallowRef(false)

async function saveArticle() {
  saving.value = true
  const method = isNewArticle ? 'POST' : 'PUT'
  try {
    const { path } = await api(`/article`, method, draft.value)
    setTimeout(() => localStorage.removeItem(storageKey), 3000)
    // 将文章路径传递给父组件
    emits('submit', path)
  } finally {
    saving.value = false
  }
}

/// endregion 文章保存
</script>

<template>
  <form class="flex flex-col items-center gap-6" @submit.prevent.stop>
    <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
      <label class="flex flex-wrap items-center gap-4 text-sm">
        <span>文章标题</span>
        <input
          v-model="draft.title"
          :disabled="saving"
          class="flex-1"
          name="title"
          placeholder="文章标题"
          required
          type="text"
        />
      </label>
      <label class="flex flex-wrap items-center gap-4 text-sm">
        <span>访问路径</span>
        <input
          v-model="draft.path"
          :disabled="saving"
          class="flex-1"
          name="path"
          placeholder="访问路径"
          required
          type="text"
        />
      </label>
      <label class="flex flex-wrap items-center gap-4 text-sm">
        <span>封面链接</span>
        <input
          v-model="draft.cover"
          :disabled="saving"
          class="flex-1"
          name="cover"
          placeholder="封面链接"
          required
          type="text"
        />
      </label>
      <label class="flex flex-wrap items-center gap-4 text-sm">
        <span>标签(空格分隔)</span>
        <input
          v-model="editTags"
          :disabled="saving"
          class="flex-1"
          name="tags"
          placeholder="标签(空格分隔)"
          required
          type="text"
        />
      </label>
    </div>
    <MdEditor
      v-model="draft.content"
      :no-img-zoom-in="false"
      :theme="$colorMode.value"
      code-theme="gradient"
      editor-id="edit"
      preview-theme="default"
      @on-upload-img="onUploadImg"
      @on-error="catchEditorError"
    />
    <Btn :disabled="saving" class="w-full max-w-xl" @click="saveArticle">
      保存发布
    </Btn>
  </form>
</template>
