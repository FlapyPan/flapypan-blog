<script setup>
const settingStore = useSettingStore()

/// region 标签数据
const {
  pending: fetchingTagList,
  data: tagList,
  error: tagListError,
  execute: getTagList,
} = await useAsyncData(`tag`, () => api({ url: `/tag` }))
/// endregion 标签数据

/// region 文章列表
const {
  pending: fetchingArticleData,
  data: articleData,
  error: articleDataError,
  execute: getArticleData,
} = await useAsyncData(`article:yearly`, () => api({ url: `/article/group-by/year` }))
/// endregion 文章列表

/// region 标签添加
const showTagEditor = ref(false)
const newTagName = ref('')
const addingTag = ref(false)
const addTagError = ref(null)

async function addTag() {
  addTagError.value = null
  addingTag.value = true
  const { error } = await useAsyncData(
    `tag:add:${newTagName.value}`,
    () => api({ url: `/tag`, method: 'POST', payload: { name: newTagName.value } }),
    { server: false },
  )
  if (error.value) {
    addTagError.value = error.value.message
  } else {
    // 添加后刷新数据
    await getTagList()
    showTagEditor.value = false
  }
  addingTag.value = false
}

/// endregion 标签添加

useHead({
  title: `归档 - ${settingStore.value.settings?.siteTitle ?? '博客'}`,
})
</script>

<template>
  <div class="page">
    <page-head
      title="文章归档"
      sub-title="看看我都水了什么文章。" />
    <refresh-button
      :loading="fetchingTagList || fetchingArticleData"
      @refresh="() => { getTagList();getArticleData() }" />
    <h3 class="mt-6 mb-3 flex items-center">
      <span class="text-2xl">
        标签
      </span>
      <client-only>
        <template v-if="settingStore.isLogin">
          <f-btn class="ml-2" text icon="mingcute-add-line" @click="showTagEditor = true">
            添加
          </f-btn>
          <f-dialog v-model="showTagEditor" title="添加标签" closable>
            <form class="mt-8 flex flex-col gap-6" @submit.prevent.stop>
              <input
                v-model="newTagName" type="text" name="tagName" placeholder="标签名" required :disabled="addingTag">
              <f-btn type="submit" :disabled="addingTag" @click="addTag()">
                添加
              </f-btn>
              <error-alert :text="addTagError" :show="addTagError" />
            </form>
          </f-dialog>
        </template>
      </client-only>
    </h3>
    <error-alert :text="tagListError" :show="tagListError" />
    <div class="flex items-center gap-4 flex-wrap mt-6">
      <template v-for="({ name }) in tagList" :key="name">
        <f-btn icon="mingcute:tag-line" :to="`/tag/${name}`" text>
          {{ name }}
        </f-btn>
      </template>
    </div>
    <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error" />
    <div class="mt-12">
      <template v-for="{ year, list } in (articleData ?? [])" :key="year">
        <h3 class="mt-4 mb-2 text-2xl">
          {{ year }}
        </h3>
        <article-timeline :list="list" />
      </template>
    </div>
  </div>
</template>

<style scoped>
</style>
