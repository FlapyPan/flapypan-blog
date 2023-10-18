<script setup>
const settingStore = useSettingStore()

onMounted(() => {
  if (!settingStore.value.isLogin) settingStore.value.loginDialogVisible = true
})

/// region 博客设置
const savingSettings = ref(false)
const saveSettingError = ref(null)

async function saveSetting() {
  saveSettingError.value = null
  savingSettings.value = true
  try {
    const data = await api({ url: '/setting', method: 'POST', payload: settingStore.value.settings })
    settingStore.value.settings = {
      ...settingStore.value.settings,
      ...data,
    }
  } catch (e) {
    saveSettingError.value = e.message
  } finally {
    savingSettings.value = false
  }
}

/// endregion 博客设置

/// region 搜索添加固定文章
const keyword = ref('')
const queryPage = ref(1)
const articleData = ref({})
const isFetchingArticle = ref(false)
const fetchArticleError = ref(null)

async function fetchArticle(reset = true) {
  if (reset) queryPage.value = 1
  if (keyword.value.trim() === '') return
  isFetchingArticle.value = true
  try {
    articleData.value = await api({ url: `/article?keyword=${keyword.value}&page=${queryPage.value - 1}&size=${settingStore.value.settings?.pageSize ?? 12}` })
  } catch (e) {
    fetchArticleError.value = e.message
  } finally {
    isFetchingArticle.value = false
  }
}

watch(queryPage, () => fetchArticle(false))

function addPath(article) {
  if (settingStore.value.links.find((a) => a.name === article.title)) return
  settingStore.value.links.push({ name: article.title, url: article.path })
}

const savingLinks = ref(false)
const saveLinksError = ref(null)

async function saveLinks() {
  saveLinksError.value = null
  savingLinks.value = true
  try {
    settingStore.value.links = await api({ url: '/link', method: 'POST', payload: settingStore.value.links })
  } catch (e) {
    saveLinksError.value = e.message
  } finally {
    savingLinks.value = false
  }
}

/// endregion 搜索添加固定文章

// 格式化时间
const formatter = new Intl.DateTimeFormat(
  'zh-CN',
  {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/ShangHai',
  },
)
const formatDate = (s) => formatter.format(Date.parse(s) ?? Date.now())

const title = `设置 - ${settingStore.value.settings.siteTitle ?? '博客'}`
const description = `博客设置`
const meta = {
  title,
  description,
  ogTitle: title,
  ogDescription: description,
}
useSeoMeta(meta)
</script>

<template>
  <div class="page">
    <client-only>
      <template v-if="settingStore.isLogin">
        <div class="flex flex-col items-center gap-6">
          <p class="text-xs mt-4">
            注意：只有点击对应的保存按钮后才会保存至服务器
          </p>
          <h3 class="text-lg w-full">
            基础信息设置
          </h3>
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-wrap items-center gap-4">
              <span>站点标题</span>
              <input
                v-model="settingStore.settings.siteTitle" class="flex-1" type="text" name="title"
                placeholder="站点标题" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>站点图标链接</span>
              <input
                v-model="settingStore.settings.favicon" class="flex-1" type="text" name="title"
                placeholder="站点图标链接" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>站点底部信息</span>
              <input
                v-model="settingStore.settings.footer" class="flex-1" type="text" name="title"
                placeholder="站点底部信息" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>每页加载数量</span>
              <input
                v-model.number="settingStore.settings.pageSize" class="flex-1" type="text" name="title"
                placeholder="每页加载数量" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>默认封面链接</span>
              <input
                v-model="settingStore.settings.banner" class="flex-1" type="text" name="title"
                placeholder="默认封面链接" required :disabled="savingSettings">
            </label>
          </div>
          <h3 class="text-lg w-full">
            个人信息设置
          </h3>
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-wrap items-center gap-4">
              <span>头像链接</span>
              <input
                v-model="settingStore.settings.avatar" class="flex-1" type="text" name="title"
                placeholder="头像链接" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>作者名</span>
              <input
                v-model="settingStore.settings.name" class="flex-1" type="text" name="title"
                placeholder="作者名" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>个人介绍</span>
              <input
                v-model="settingStore.settings.info" class="flex-1" type="text" name="title"
                placeholder="个人介绍" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>邮箱</span>
              <input
                v-model="settingStore.settings.email" class="flex-1" type="text" name="title"
                placeholder="邮箱" required :disabled="savingSettings">
            </label>
          </div>
          <h3 class="text-lg w-full">
            Giscus 设置
          </h3>
          <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="flex flex-wrap items-center gap-4">
              <span>giscusRepo</span>
              <input
                v-model="settingStore.settings.giscusRepo" class="flex-1" type="text" name="title"
                placeholder="giscusRepo" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>giscusRepoId</span>
              <input
                v-model="settingStore.settings.giscusRepoId" class="flex-1" type="text" name="title"
                placeholder="giscusRepoId" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>giscusCategory</span>
              <input
                v-model="settingStore.settings.giscusCategory" class="flex-1" type="text" name="title"
                placeholder="giscusCategory" required :disabled="savingSettings">
            </label>
            <label class="flex flex-wrap items-center gap-4">
              <span>giscusCategoryId</span>
              <input
                v-model="settingStore.settings.giscusCategoryId" class="flex-1" type="text" name="title"
                placeholder="giscusCategoryId" required :disabled="savingSettings">
            </label>
          </div>
          <error-alert :show="saveSettingError" :text="saveSettingError" />
          <f-btn class="w-full max-w-xl" :disabled="savingSettings" @click="saveSetting()">
            保存设置
          </f-btn>
          <h3 class="text-lg w-full">
            固定链接设置
          </h3>
          <div class="flex items-center flex-wrap gap-3 select-none">
            <div v-for="(l, i) in settingStore.links" :key="i">
              <span class="cursor-default">{{ l.name }}</span>
              <icon
                class="cursor-pointer text-lg" name="mingcute:delete-line"
                @click="settingStore.links.splice(i, 1)" />
            </div>
          </div>
          <input
            v-model="keyword" class="w-full" type="text" placeholder="输入关键字回车搜索"
            @keydown.enter="fetchArticle()">
          <error-alert :show="fetchArticleError" :text="fetchArticleError" />
          <ul v-if="articleData?.content?.length > 0" class="w-full">
            <li
              v-for="article in articleData.content" :key="article.id"
              class="flex items-center my-1 py-1 px-2 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg"
              @click="addPath(article)">
              <span class="mr-2">{{ formatDate(article.createDate) }}</span>
              <span>{{ article.title }}</span>
              <div class="flex-1"></div>
              <div class="hidden sm:flex items-center gap-2">
                <template v-for="({ name }) in article.tags" :key="name">
                  <div class="flex items-center">
                    <icon name="mingcute:tag-line" />
                    <span>{{ name }}</span>
                  </div>
                </template>
              </div>
            </li>
          </ul>
          <f-page v-model="queryPage" class="mt-4" :page-data="articleData" />
          <f-btn class="w-full max-w-xl" :disabled="savingLinks" @click="saveLinks()">
            保存固定链接
          </f-btn>
        </div>
      </template>
      <page-head v-else title="请登录" />
    </client-only>
  </div>
</template>

<style scoped>

</style>
