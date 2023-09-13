<script setup>
import { reactive, ref } from 'vue'
import { useSettingStore } from '@/store/setting'
import router from '@/router'
import { api } from '@/api'
import { useAccessStore } from '@/store/access'

const settingStore = useSettingStore()
const accessStore = useAccessStore()

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
  formData.append('remember-me', `${form.remember}`)
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

    <v-dialog v-if="!settingStore.isLogin" v-model="loginDialog" max-width="500px">
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

      <v-list-item class="py-2" density="comfortable" rounded="xl"
                   :prepend-avatar="settingStore.settings?.avatar"
                   :title="settingStore.settings?.name" :subtitle="settingStore.settings?.info"
                   to="/" :active="router.currentRoute.value.name==='Home'"
                   color="primary"
      ></v-list-item>

      <v-list-item to="/archive" color="orange" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="orange" size="30">
            <v-icon color="white" class="text-body-1">mdi-archive</v-icon>
          </v-avatar>
        </template>
        归档
      </v-list-item>

      <v-divider></v-divider>
      <v-list-subheader>固定的文章</v-list-subheader>

      <v-list-item v-for="{name,url} in settingStore.links" :to="`/${url}`" :key="url"
                   color="primary" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="primary" size="30">
            <v-icon color="white" class="text-body-1">mdi-book</v-icon>
          </v-avatar>
        </template>
        {{ name }}
      </v-list-item>

      <v-divider class="mb-2"></v-divider>
      <v-list-subheader>设置</v-list-subheader>

      <v-list-item v-if="settingStore.isLogin" to="/new" color="primary" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="primary" size="30">
            <v-icon color="white" class="text-body-1">mdi-plus</v-icon>
          </v-avatar>
        </template>
        新文章
      </v-list-item>
      <v-list-item v-if="settingStore.isLogin" to="/setting" color="light-blue"
                   rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="light-blue" size="30">
            <v-icon color="white" class="text-body-1">mdi-cog</v-icon>
          </v-avatar>
        </template>
        博客设置
      </v-list-item>
      <v-list-item v-if="settingStore.isLogin" @click="logout" color="red-lighten-1" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="red-lighten-1" size="30">
            <v-icon color="white" class="text-body-1">mdi-logout</v-icon>
          </v-avatar>
        </template>
        退出登录
      </v-list-item>
      <v-list-item v-else @click="loginDialog=true" :active="loginDialog" color="indigo" rounded="xl">
        <template v-slot:prepend>
          <v-avatar color="indigo" size="30">
            <v-icon color="white" class="text-body-1">mdi-login</v-icon>
          </v-avatar>
        </template>
        登录
      </v-list-item>

      <v-divider class="mb-2"></v-divider>
      <v-list-subheader>统计信息</v-list-subheader>

      <v-list-item color="cyan" title="今日阅读量" :subtitle="accessStore.baseInfo.today">
        <template v-slot:prepend>
          <v-avatar color="cyan" size="30">
            <v-icon color="white" class="text-body-1">mdi-book-open</v-icon>
          </v-avatar>
        </template>
      </v-list-item>

      <v-list-item color="pink" title="总阅读量" :subtitle="accessStore.baseInfo.all">
        <template v-slot:prepend>
          <v-avatar color="pink" size="30">
            <v-icon color="white" class="text-body-1">mdi-book-open</v-icon>
          </v-avatar>
        </template>
      </v-list-item>

    </v-list>

  </v-navigation-drawer>
</template>

<style scoped>

</style>
