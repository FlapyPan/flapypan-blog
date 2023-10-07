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
  <v-container style="max-width: 1000px">
    <h2 class="mt-6 mb-3 d-flex align-center">
      归档
      <refresh-button
        class="ml-1" :loading="fetchingTagList || fetchingArticleData"
        @refresh="() => { getTagList();getArticleData() }" />
    </h2>
    <h3 class="mt-6 mb-3 d-flex align-center">
      标签
      <client-only>
        <v-menu v-if="settingStore.isLogin" v-model="tagEditor" location="end" :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn class="ml-2" v-bind="props" icon="mdi-plus" size="small" variant="text" color="primary" />
          </template>

          <v-card class="ma-2 pt-2" min-width="300" elevation="2">
            <v-card-item>
              <v-text-field v-model="newTagName" label="标签名" />
            </v-card-item>
            <v-card-item v-show="addTagError != null">
              <v-alert rounded="lg" :text="addTagError" type="error" />
            </v-card-item>
            <v-card-actions>
              <v-spacer />
              <v-btn
                variant="text" :loading="addingTag" :disabled="newTagName.trim() === ''"
                @click="addTag">
                保存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </client-only>
    </h3>
    <v-alert v-show="tagListError" rounded="lg" :text="tagListError" type="error" />
    <div class="flex-wrap d-flex mb-2">
      <template v-for="({ name }, i) in tagList" :key="name">
        <v-divider v-if="i !== 0 && i % 20 === 0" class="my-4" color="info" />
        <v-btn
          class="mx-1 my-2 text-none" size="small" prepend-icon="mdi-tag" rounded="xl"
          variant="tonal" :to="`/tag/${name}`" :color="colorMap(name)" @click:close="() => {}">
          {{ name }}
        </v-btn>
      </template>
    </div>
    <v-alert v-show="articleDataError" rounded="lg" :text="articleDataError" type="error" />
    <template v-for="{ year, list } in (articleData ?? [])" :key="year">
      <h3 class="mt-4 mb-2">
        {{ year }}
      </h3>
      <article-timeline :list="list" />
    </template>
  </v-container>
</template>

<style scoped>
</style>
