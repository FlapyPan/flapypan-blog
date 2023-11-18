<script setup>
const route = useRoute()
const auth = useAuth()
const settingStore = useSettingStore()

/// region 获取 tag 信息
const tag = computed(() => route.params.tag ?? '')
const queryPage = computed({
  get: () => +(route.query.page || 1),
  set: (val) => {
    if (val) navigateTo({ path: `/tag/${tag.value}?page=${val}`, replace: true })
    else navigateTo({ path: `/tag/${tag.value}`, replace: true })
  },
})
const {
  data,
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
    return navigateTo({ path: `/tag/${name}`, replace: true })
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
    return navigateTo({ path: '/archive', replace: true })
  } catch (e) {
    tagDeleteError.value = e.message
  } finally {
    deletingTag.value = false
  }
}

const title = `标签: ${tag.value ?? '标签'} - ${settingStore.value.settings.siteTitle ?? '博客'}`
const description = `${tag.value ?? '标签'} 下的所有文章`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useServerSeoMeta(meta)
useSeoMeta(meta)
</script>

<template>
  <div class="page">
    <page-head class="mb-6">
      <template #title>
        <icon name="mingcute:tag-line" />
        {{ tag }}
      </template>
      <template #subTitle>
        <client-only>
          <template v-if="auth.state.value.isLogin">
            <f-btn class="mr-2" icon="mingcute-edit-line" text @click="showTagEditor = true">
              编辑
            </f-btn>
            <f-dialog v-model="showTagEditor" closable title="编辑标签">
              <form class="mt-8 flex flex-col gap-6" @submit.prevent.stop>
                <input
                  v-model="editTagName" :disabled="updatingTag" name="tagName" placeholder="标签名" required
                  type="text">
                <f-btn :disabled="updatingTag" type="submit" @click="updateTag()">
                  保存
                </f-btn>
                <error-alert :show="updateError" :text="updateError" />
              </form>
            </f-dialog>
            <f-btn icon="mingcute-delete-line" text @click="showTagDeleteDialog = true">
              删除
            </f-btn>
            <f-dialog v-model="showTagDeleteDialog" closable title="确认删除">
              <form class="mt-8 flex flex-col gap-6" @submit.prevent.stop>
                <f-btn :disabled="deletingTag" type="submit" @click="deleteTag()">
                  确认
                </f-btn>
                <error-alert :show="tagDeleteError" :text="tagDeleteError" />
              </form>
            </f-dialog>
          </template>
        </client-only>
      </template>
    </page-head>
    <error-alert :show="fetchDataError" :text="fetchDataError" redirect />
    <article-timeline :list="data?.articleData?.content" />
    <p v-show="fetchingData" class="text-center text-zinc-500 text-sm py-2">
      加载中...
    </p>
    <f-page v-model="queryPage" :page-data="data?.articleData" class="mt-4" />
  </div>
</template>

<style scoped>

</style>
