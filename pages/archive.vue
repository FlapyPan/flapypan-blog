<script setup>
const router = useRouter()
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
const tagEditor = ref(false)
const newTagName = ref('')
const addingTag = ref(false)
const addTagError = ref(null)

async function addTag() {
  addTagError.value = null
  addingTag.value = true
  const { error } = await useAsyncData(`tag`, () => api({ url: `/article/group-by/year` }))
  if (error.value) {
    addTagError.value = error.value.message
  } else {
    // 添加后刷新数据
    router.go(0)
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
          <f-dialog v-model="tagEditor" title="添加标签" closable>
            添加标签
          </f-dialog>
          <f-btn class="ml-2" text icon="mingcute-add-line" @click="tagEditor = true">
            添加
          </f-btn>
        </template>
        <!--        <v-menu v-if="settingStore.isLogin" v-model="tagEditor" location="end" :close-on-content-click="false"> -->
        <!--          <template #activator="{ props }"> -->
        <!--            <v-btn class="ml-2" v-bind="props" icon="mdi-plus" size="small" variant="text" color="primary" /> -->
        <!--          </template> -->

        <!--          <v-card class="ma-2 pt-2" min-width="300" elevation="2"> -->
        <!--            <v-card-item> -->
        <!--              <v-text-field v-model="newTagName" label="标签名" /> -->
        <!--            </v-card-item> -->
        <!--            <v-card-item v-show="addTagError != null"> -->
        <!--              <v-alert rounded="lg" :text="addTagError" type="error" /> -->
        <!--            </v-card-item> -->
        <!--            <v-card-actions> -->
        <!--              <v-spacer /> -->
        <!--              <v-btn -->
        <!--                variant="text" :loading="addingTag" :disabled="newTagName.trim() === ''" -->
        <!--                @click="addTag"> -->
        <!--                保存 -->
        <!--              </v-btn> -->
        <!--            </v-card-actions> -->
        <!--          </v-card> -->
        <!--        </v-menu> -->
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
