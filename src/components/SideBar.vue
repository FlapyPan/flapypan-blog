<script setup>
import { reactive, ref } from 'vue'
import { useSettingStore } from '@/store/setting'
import router from '@/router'
import ArticleEditor from '@/components/ArticleEditor.vue'
import { api } from '@/api'

const settingStore = useSettingStore()

/// region 新文章
const writeDialog = ref(false)
const onArticleSubmit = (path) => {
  // 添加完成自动跳转
  writeDialog.value = false
  router.push(`/${ path }`)
}
/// endregion 新文章


/// region 登录
const loginDialog = ref(false)
const form = reactive({
  username: '',
  password: '',
  remember: false,
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
  const formData = new FormData()
  formData.append('username', form.username)
  formData.append('password', form.password)
  formData.append('remember-me', `${ form.remember }`)
  try {
    await api(`/auth/login`, 'POST', formData, false)
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

</script>

<template>
  <v-navigation-drawer border="none" location="left" v-model="settingStore.sideBarOpened">

    <v-dialog v-if="settingStore.isLogin" v-model="writeDialog" fullscreen>
      <v-sheet>
        <v-toolbar color="transparent">
          <v-btn icon dark @click="writeDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>写作</v-toolbar-title>
        </v-toolbar>
        <article-editor @submit="onArticleSubmit"></article-editor>
      </v-sheet>
    </v-dialog>

    <v-dialog v-if="!settingStore.isLogin" v-model="loginDialog" max-width="500px" transition="dialog-top-transition"
              scrollable>
      <v-card>
        <v-toolbar color="transparent">
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
            <v-checkbox v-model="form.remember" label="在此设备上记住我"></v-checkbox>
            <v-btn color="primary" :loading="isDoLogin" type="submit" block class="mt-2" text="登录"></v-btn>
          </v-form>
        </v-card-item>
      </v-card>
    </v-dialog>

    <v-list :nav="true" density="compact">

      <v-list-item density="comfortable" :prepend-avatar="settingStore.settings?.avatar"
                   :title="settingStore.settings?.name" :subtitle="settingStore.settings?.info"
      ></v-list-item>

      <v-list-item to="/" :active="router.currentRoute.value.name==='Home'" prepend-icon="mdi-home"
                   base-color="primary">
        主页
      </v-list-item>
      <v-list-item to="/archive" prepend-icon="mdi-archive" base-color="orange">归档
      </v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>固定的文章</v-list-subheader>

      <v-list-item v-for="{name,url} in settingStore.links" :to="`/${url}`" :key="url" prepend-icon="mdi-book"
                   base-color="cyan">
        {{ name }}
      </v-list-item>

      <v-divider class="mb-2"></v-divider>
      <v-list-subheader>设置</v-list-subheader>

      <v-list-item v-if="settingStore.isLogin" @click="writeDialog=true" prepend-icon="mdi-plus" base-color="primary">
        新文章
      </v-list-item>
      <v-list-item v-if="settingStore.isLogin" to="/setting" :active="false" prepend-icon="mdi-cog"
                   base-color="light-blue">
        博客设置
      </v-list-item>
      <v-list-item v-if="settingStore.isLogin" @click="logout" prepend-icon="mdi-logout" base-color="red-lighten-1">退出登录
      </v-list-item>
      <v-list-item v-else @click="loginDialog=true" :active="false" prepend-icon="mdi-login" base-color="indigo">
        登录
      </v-list-item>

    </v-list>

  </v-navigation-drawer>
</template>

<style scoped>

</style>
