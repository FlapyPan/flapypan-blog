<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useSettingStore } from '@/store/setting'
import ArticleList from '@/components/ArticleCardList.vue'
import { api } from '@/api'
import { useFavicon } from '@vueuse/core'
import { useThemeStore } from '@/store/theme'
import SideBar from '@/components/SideBar.vue'

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

/// region 站点图标
const favicon = computed(() => settingStore.settings.favicon)
useFavicon(favicon)
/// endregion 站点图标

</script>

<template>
  <v-app>
    <v-dialog v-model="searchDialog" width="95vw" max-width="800px"
              transition="dialog-top-transition" scrollable>
      <div class="rounded-xl" style="background-color: rgb(var(--v-theme-background));">
        <v-toolbar color="transparent">
          <v-btn icon dark @click="searchDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>搜索</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-text-field ref="searchInput" v-model="keyword" @keydown.enter="searchArticle()"
                        label="搜索标题、分类、标签"></v-text-field>
          <article-list :article-data="searchData" mdCols="6" :page="page" style="height: 70vh;overflow-y: auto"
                        @on-page="(p)=>page=p" @on-route="searchDialog=false"></article-list>
        </v-container>
      </div>
    </v-dialog>

    <v-app-bar class="app-bar align-center" elevation="0">
      <template #prepend>
        <v-btn @click="settingStore.sideBarOpened=true" class="d-flex d-lg-none" icon="mdi-menu"></v-btn>
        <v-app-bar-title class="rounded mr-2 d-none d-sm-flex" v-ripple>
          <router-link to="/" class="pa-2 text-decoration-none text-high-emphasis">
            {{ settingStore.settings?.siteTitle }}
          </router-link>
        </v-app-bar-title>
      </template>
      <template v-slot:append>
        <v-btn icon="mdi-magnify" @click="openSearchDialog()"></v-btn>
        <v-btn :icon="themeStore.isDark?'mdi-weather-night':'mdi-weather-sunny'"
               @click="themeStore.toggleTheme()"></v-btn>
        <a class="text-none v-btn--variant-text" :href="`mailto:${settingStore.settings?.email}`" target="_blank">
          <v-btn icon="mdi-at"></v-btn>
        </a>
        <a class="text-none v-btn--variant-text" href="https://github.com/FlapyPan/flapypan-blog" target="_blank">
          <v-btn icon="mdi-github"></v-btn>
        </a>
      </template>
    </v-app-bar>

    <side-bar></side-bar>

    <v-main>
      <router-view></router-view>
      <footer class="text-center pt-2 pb-3 text-body-2 text-medium-emphasis">
        {{ settingStore.settings?.footer }}
      </footer>
    </v-main>

  </v-app>
</template>

<style>
</style>
