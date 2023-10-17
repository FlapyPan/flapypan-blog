<script setup>
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const settingStore = useSettingStore()

/// region 获取 tag 信息
const tag = computed(() => route.params.tag ?? '')
const queryPage = computed({
  get: () => +(route.query.page || 1),
  set: (val) => {
    if (val) router.push(`/tag/${tag.value}?page=${val}`)
    else router.push(`/tag/${tag.value}`)
  },
})
const {
  data,
  execute: fetchData,
  pending: fetchingData,
  error: fetchDataError,
} = useAsyncData(
  `tag:${tag.value}`,
  async () => {
    const [tagData, articleData] = await Promise.all([
      api({ url: `/tag/${tag.value}` }),
      api({ url: `/tag/${tag.value}/article?page=${queryPage.value - 1}&size=${settingStore.value.settings?.pageSize ?? 12}` }),
    ])
    return { tagData, articleData }
  },
  { watch: [tag, queryPage] },
)
/// endregion 获取 tag 信息

/// region 编辑 tag
const editTagName = ref(tag.value)
const showTagEditor = ref(false)
const updatingTag = ref(false)
const updateError = ref(null)

async function updateTag() {
  updateError.value = null
  updatingTag.value = true
  try {
    const name = await api({
      url: '/tag',
      method: 'PUT',
      payload: {
        id: data.value.tagData.id,
        name: editTagName.value.trim(),
      },
    })
    showTagEditor.value = false
    return router.replace(`/tag/${name}`)
  } catch (e) {
    updateError.value = e.message
  } finally {
    updatingTag.value = false
  }
}

/// endregion 编辑 tag

/// region 删除 tag
const deletingTag = ref(false)
const tagDeleteError = ref(null)
const showTagDeleteDialog = ref(false)

async function deleteTag() {
  tagDeleteError.value = null
  deletingTag.value = true
  try {
    await api({
      url: `/tag/${data.value.tagData.id}`,
      method: 'DELETE',
      payload: {
        id: data.value.tagData.id,
        name: editTagName.value.trim(),
      },
    })
    return router.replace('/archive')
  } catch (e) {
    tagDeleteError.value = e.message
  } finally {
    deletingTag.value = false
  }
}

const title = computed(() => `${tag.value ?? '标签'} - ${settingStore.value.settings?.siteTitle ?? '博客'}`)
useHead({
  title,
})
</script>

<template>
  <div class="page">
    <page-head class="mb-6" :title="tag">
      <template #subTitle>
        <client-only>
          <template v-if="settingStore.isLogin">
            <f-btn class="mr-2" text icon="mingcute-edit-line" @click="showTagEditor = true">
              编辑
            </f-btn>
            <f-dialog v-model="showTagEditor" title="编辑标签" closable>
              <form class="mt-8 flex flex-col gap-6" @submit.prevent.stop>
                <input
                  v-model="editTagName" type="text" name="tagName" placeholder="标签名" required
                  :disabled="updatingTag">
                <f-btn type="submit" :disabled="updatingTag" @click="updateTag()">
                  保存
                </f-btn>
                <error-alert :text="updateError" :show="updateError" />
              </form>
            </f-dialog>
            <f-btn text icon="mingcute-delete-line" @click="showTagDeleteDialog = true">
              删除
            </f-btn>
            <f-dialog v-model="showTagDeleteDialog" title="确认删除" closable>
              <form class="mt-8 flex flex-col gap-6" @submit.prevent.stop>
                <f-btn type="submit" :disabled="deletingTag" @click="deleteTag()">
                  确认
                </f-btn>
                <error-alert :text="tagDeleteError" :show="tagDeleteError" />
              </form>
            </f-dialog>
          </template>
        </client-only>
      </template>
      <refresh-button :loading="fetchingData" @refresh="fetchData()">
      </refresh-button>
    </page-head>
    <error-alert :show="fetchDataError" :text="fetchDataError" />
    <article-timeline :list="data?.articleData?.content" />
    <nav class="mt-4 flex justify-center items-center gap-4">
      <f-btn :disabled="queryPage <= 1" text @click="queryPage--">
        <icon class="mr-1" name="mingcute:arrow-left-circle-line" />
        上一页
      </f-btn>
      <f-btn :disabled="data?.articleData?.last" text @click="queryPage++">
        下一页
        <icon class="ml-1" name="mingcute:arrow-right-circle-line" />
      </f-btn>
    </nav>
  </div>
</template>

<style scoped>

</style>
