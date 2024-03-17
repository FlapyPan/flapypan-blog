<script setup lang="ts">
import { MdEditor, type Themes } from 'md-editor-v3'
import { useToast } from 'vue-toastification'
import type { ArticleDraft } from '~/types/api'
import 'md-editor-v3/lib/style.css'

const props = withDefaults(defineProps<{
  articleData?: ArticleDraft
}>(), {
  articleData: () => ({
    _id: '',
    title: '',
    path: '',
    cover: '',
    content: '',
    tags: [],
  }),
})
const emits = defineEmits<{ (e: 'submit', path: string): void }>()

const toast = useToast()

/// region 文章数据

const draft = ref(props.articleData)
const editTags = shallowRef('')
function addTag() {
  if (!editTags.value) return
  const tag = editTags.value.trim()
  editTags.value = ''
  if (draft.value.tags.includes(tag)) return
  draft.value.tags = [...draft.value.tags, tag].toSorted()
}
function delTag(index: number) {
  if (index < 0 || index >= draft.value.tags.length) return
  draft.value.tags.splice(index, 1)
}
function delLastTag() {
  if (editTags.value) return
  if (!draft.value.tags.length) return
  draft.value.tags.pop()
}

/// endregion

const catchEditorError = ({ message }: Error) => toast.error(message)

/// region 图片上传

async function uploadImg(file: File) {
  const form = new FormData()
  form.append('file', file, file.name)
  // 上传获取图片id
  const _id = await api('/picture', 'POST', form, false)
  return `/api/picture/${_id}`
}

function openUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = false
  input.onchange = async () => {
    if (!input.files?.length) return
    draft.value.cover = await uploadImg(input.files[0])
  }
  input.click()
}

async function onUploadImg(files: File[], cb: (urls: string[]) => void) {
  const res = await Promise.all(files.map(uploadImg))
  cb(res)
}

/// endregion

/// region 文章保存

const saving = shallowRef(false)

async function saveArticle() {
  saving.value = true
  const method = !props.articleData._id ? 'POST' : 'PUT'
  try {
    const { path } = await api<{ path: string }>(`/article`, method, draft.value)
    // 将文章路径传递给父组件
    emits('submit', path)
  } finally {
    saving.value = false
  }
}

/// endregion
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent.stop>
    <TextFieldContainer>
      <TextField v-model="draft.title" label="文章标题" :disabled="saving" />
      <TextField v-model="draft.path" label="阅读路径" :disabled="saving" />
      <div class="flex items-center gap-2">
        <TextField v-model="draft.cover" class="flex-1" label="封面链接" :disabled="saving" />
        <Btn secondary @click="openUpload">
          上传封面
        </Btn>
      </div>
      <div v-auto-animate class="flex flex-wrap items-center gap-1 rounded-md border px-2 py-1">
        <span
          v-for="(tag, i) in draft.tags"
          :key="tag"
          class="flex items-center gap-1 rounded-xl bg-primary-500 px-2 text-white"
        >
          <span class="text-sm">{{ tag }}</span>
          <Icon name="mingcute:close-line" class="cursor-pointer" @click="delTag(i)" />
        </span>
        <input
          id="article-tags"
          v-model="editTags"
          :disabled="saving"
          class="flex-1 border-none p-1 ring-0 focus:ring-0"
          placeholder="回车或空格添加标签"
          @keydown.delete="delLastTag()"
          @keydown.enter.prevent.stop="addTag()"
          @keydown.space.prevent.stop="addTag()"
          @blur="addTag()"
        />
      </div>
    </TextFieldContainer>
    <div class="flex justify-center">
      <Btn primary :disabled="saving" class="w-full max-w-lg" @click="saveArticle">
        保存发布
      </Btn>
    </div>
    <MdEditor
      v-model="draft.content"
      :no-img-zoom-in="false"
      code-theme="gradient"
      editor-id="edit"
      :theme="$colorMode.preference as Themes"
      preview-theme="default"
      @on-upload-img="onUploadImg"
      @on-error="catchEditorError"
    />
  </form>
</template>
