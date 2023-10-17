<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import 'https://cdn.staticfile.org/compressorjs/1.2.1/compressor.min.js'

const props = defineProps({
  articleData: {
    type: Object,
    default: () => ({
      id: 0,
      title: '',
      path: '',
      cover: '',
      content: '',
      tagNames: [],
    }),
  },
})
const emits = defineEmits(['submit'])

// 判断是否是新文章
const isNewArticle = !(props.articleData?.id > 0)

/// region 文章编辑持久化
const storageKey = isNewArticle ? 'draft_new' : `draft_id_${props.articleData.id}`

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
/// endregion 文章编辑持久化

/// region 标签数据
const tagData = ref([])

async function getTagList() {
  let tags
  try {
    tags = await api({ url: '/tag' })
  } catch (e) {
    tags = []
  }
  tagData.value = tags.map((tag) => tag.name)
  // 去除无效标签
  draft.value.tagNames = draft.value.tagNames.filter((tagName) => tagData.value.includes(tagName))
}

getTagList()
/// endregion 标签数据

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
      // 上传获取路径
      const path = await api({ url: '/upload', method: 'POST', payload: form, jsonPayload: false })
      res.push(path)
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
    const path = await api({ url: `/article`, method, payload: draft.value })
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
    <p class="text-xs mt-4">
      编辑的内容会在本机自动保存，编辑完成后点击发布按钮发布
    </p>
    <div class="mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <label class="flex flex-wrap items-center gap-4">
        <span>文章标题</span>
        <input
          v-model="draft.title" class="flex-1" type="text" name="title" placeholder="文章标题" required
          :disabled="saving">
      </label>
      <label class="flex flex-wrap items-center gap-4">
        <span>访问路径</span>
        <input
          v-model="draft.path" class="flex-1" type="text" name="path" placeholder="访问路径" required
          :disabled="saving">
      </label>
      <label class="flex flex-wrap items-center gap-4">
        <span>封面链接</span>
        <input
          v-model="draft.cover" class="flex-1" type="text" name="cover" placeholder="封面链接" required
          :disabled="saving">
      </label>
      <label class="flex flex-wrap items-center gap-4">
        <span>标签(ctrl多选)</span>
        <Listbox v-model="draft.tagNames" multiple>
          <div class="relative flex-1">
            <ListboxButton as="template">
              <f-btn>
                {{ draft.tagNames.join(', ') }}
                <icon class="text-2xl" name="mingcute:selector-vertical-line" />
              </f-btn>
            </ListboxButton>
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0">
              <ListboxOptions class="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-blur p-2 shadow-md">
                <ListboxOption v-for="tag in tagData" :key="tag" v-slot="{ selected }" :value="tag">
                  <div
                    class="p-2 rounded-lg mb-1 flex items-center cursor-pointer sm:hover:bg-primary-50 dark:sm:hover:bg-primary-900">
                    <icon v-show="selected" class="text-primary-500 mr-1" name="mingcute:check-line" />
                    {{ tag }}
                  </div>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </label>
    </div>
    <error-alert :show="editorError" :text="editorError" />
    <MdEditor
      v-model="draft.content" editor-id="edit" preview-theme="default" code-theme="gradient"
      :theme="isDark ? 'dark' : 'light'" :no-img-zoom-in="false" @on-upload-img="onUploadImg"
      @on-error="catchEditorError" />
    <error-alert :show="saveError" :text="saveError" />
    <f-btn class="w-full max-w-xl" :disabled="saving" @click="saveArticle">
      保存发布
    </f-btn>
  </form>
</template>

<style scoped>
</style>
