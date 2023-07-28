<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useSettingStore } from '@/store/setting'
import ArticleList from '@/components/ArticleCardList.vue'
import { api } from '@/api'
import router from '@/router'
import ArticleEditor from '@/components/ArticleEditor.vue'
import { useFavicon } from '@vueuse/core'
import { useThemeStore } from '@/store/theme'

const settingStore = useSettingStore()
const themeStore = useThemeStore()

/// region 搜索
const searchInput = ref(null)
const searchDialog = ref(false)
const openSearchDialog = () => {
  searchDialog.value = true
  // 搜索框自动聚焦
  nextTick(() => searchInput.value.focus())
}
const keyword = ref('')
const page = ref(1)
const searchData = ref({})
const isSearching = ref(false)
const searchError = ref(null)
const searchArticle = async () => {
  if (keyword.value.trim() === '') return
  searchError.value = null
  try {
    searchData.value = await api(`/article?keyword=${keyword.value}&page=${page.value - 1}&size=${settingStore.settings?.pageSize ?? 12}`)
  } catch (e) {
    searchError.value = e
  } finally {
    isSearching.value = false
  }
}
// 监听分页，搜索数据
watch(page, searchArticle)

/// endregion 搜索

/// region 登录
const loginDialog = ref(false)
const form = reactive({
  username: '',
  password: '',
})
const usernameRule = (value) => {
  if (value?.trim() !== '') return true
  return '用户名不能为空'
}
const passwordRule = (value) => {
  if (value?.trim() !== '') return true
  return '密码不能为空'
}
const isDoLogin = ref(false)
const loginError = ref(null)
const login = async () => {
  loginError.value = null
  isDoLogin.value = true
  try {
    await api(`/auth`, 'POST', form)
    settingStore.isLogin = true
    loginDialog.value = false
  } catch (e) {
    console.error(e)
    loginError.value = e.message
  } finally {
    isDoLogin.value = false
  }
}
const logout = () => {
  api(`/auth/logout`).finally(() => {
    localStorage.removeItem('token')
    location.reload()
  })
}
/// endregion 登录

/// region 新文章
const writeDialog = ref(false)
const onArticleSubmit = (path) => {
  // 添加完成自动跳转
  writeDialog.value = false
  router.push(`/${path}`)
}
/// endregion 新文章

/// region 站点图标
const favicon = computed(() => settingStore.settings.favicon)
useFavicon(favicon)
/// endregion 站点图标

</script>

<template>
  <v-app>
    <v-dialog v-model="searchDialog" width="95vw" max-width="800px"
              transition="dialog-top-transition" scrollable>
      <v-card>
        <v-toolbar>
          <v-btn icon dark @click="searchDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>搜索</v-toolbar-title>
        </v-toolbar>
        <v-card-item>
          <v-text-field ref="searchInput" v-model="keyword" @keydown.enter="searchArticle()"
                        label="搜索标题、分类、标签"></v-text-field>
        </v-card-item>
        <v-container style="height: 70vh;overflow-y: scroll">
          <article-list :article-data="searchData" mdCols="6" :page="page"
                        @on-page="(p)=>page=p" @on-route="searchDialog=false"></article-list>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-if="!settingStore.isLogin" v-model="loginDialog" max-width="500px" transition="dialog-top-transition"
              scrollable>
      <v-card>
        <v-toolbar>
          <v-btn icon dark @click="loginDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>登录</v-toolbar-title>
        </v-toolbar>
        <v-card-item v-if="loginError!=null">
          <v-alert rounded="lg" :text="loginError" type="error"></v-alert>
        </v-card-item>
        <v-card-item class="mb-8">
          <v-form class="pa-4" validate-on="submit lazy" @submit.prevent="login">
            <v-text-field :rules="[usernameRule]" v-model="form.username" label="用户名"></v-text-field>
            <v-text-field :rules="[passwordRule]" v-model="form.password" type="password" label="密码"></v-text-field>
            <v-btn color="primary" :loading="isDoLogin" type="submit" block class="mt-2" text="登录"></v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </v-dialog>

    <v-dialog v-if="settingStore.isLogin" v-model="writeDialog" fullscreen>
      <v-card rounded="none">
        <v-toolbar>
          <v-btn icon dark @click="writeDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>写作</v-toolbar-title>
        </v-toolbar>
        <article-editor @submit="onArticleSubmit"></article-editor>
      </v-card>
    </v-dialog>

    <v-app-bar class="app-bar align-center" rounded="b-lg" elevation="0" border="b" density="comfortable">
      <template #prepend>
        <v-app-bar-title class="rounded mr-2 d-none d-sm-flex" v-ripple>
          <router-link to="/" class="pa-2 text-decoration-none text-high-emphasis">
            {{ settingStore.settings?.siteTitle }}
          </router-link>
        </v-app-bar-title>
        <div class="d-none d-sm-flex">
          <v-btn rounded="lg" variant="text" to="/" :active="false">主页</v-btn>
          <v-btn rounded="lg" variant="text" to="/archive">归档</v-btn>
          <v-btn rounded="lg" v-for="{name,url} in settingStore.links ?? []" variant="text" :key="name" :to="url">
            {{ name }}
          </v-btn>
        </div>
        <div class=" d-flex d-sm-none">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" v-bind="props"></v-btn>
            </template>
            <v-list elevation="3">
              <v-list-item to="/" title="主页" :active="false"></v-list-item>
              <v-list-item to="/archive" title="归档"></v-list-item>
              <v-list-item v-for="{name,url} in settingStore.links ?? []" variant="text" :key="name" :to="url"
                           :title="name"></v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-magnify" @click="openSearchDialog()"></v-btn>
        <v-btn :icon="themeStore.isDark?'mdi-weather-night':'mdi-weather-sunny'"
               @click="themeStore.toggleTheme()"></v-btn>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>
          <v-list elevation="3">
            <v-list-item v-if="settingStore.isLogin" title="编辑新文章" @click="writeDialog=true"></v-list-item>
            <v-list-item v-if="settingStore.isLogin" title="博客设置" @click="router.push('/setting')"></v-list-item>
            <v-list-item v-if="settingStore.isLogin" title="退出登录" @click="logout"></v-list-item>
            <v-list-item v-else title="登录" @click="loginDialog=true"></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <footer class="text-center pt-2 pb-3 text-body-2 text-medium-emphasis">
      {{ settingStore.settings?.footer }}
    </footer>
  </v-app>
</template>

<style scoped>

</style>
