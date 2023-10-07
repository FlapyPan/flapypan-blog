<script setup>
const emits = defineEmits(['close'])

const settingStore = useSettingStore()

/// region 登录
const form = reactive({
  username: '',
  password: '',
  remember: false,
})

function parseFormData() {
  const formData = new FormData()
  formData.append('username', form.username)
  formData.append('password', form.password)
  formData.append('remember-me', form.remember)
  return formData
}

function usernameRule(value) {
  if (value?.trim() !== '') return true
  return '用户名不能为空'
}

function passwordRule(value) {
  if (value?.trim() !== '') return true
  return '密码不能为空'
}

const isDoLogin = ref(false)
const loginError = ref(null)

async function login() {
  isDoLogin.value = true
  const { error } = await useAsyncData(`login:${form.username}`, () => api({
    url: `/api/login`,
    method: 'POST',
    payload: parseFormData(),
    jsonPayload: false,
  }))
  if (error.value) {
    loginError.value = error.value.message
  } else {
    settingStore.value.isLogin = true
    emits('close')
  }
  isDoLogin.value = false
}

/// endregion 登录
</script>

<template>
  <v-card>
    <v-toolbar color="transparent">
      <v-btn icon dark @click="emits('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>登录</v-toolbar-title>
    </v-toolbar>
    <v-card-item v-if="loginError != null">
      <v-alert rounded="lg" :text="loginError" type="error" />
    </v-card-item>
    <v-card-item class="mb-8">
      <v-form class="pa-4" validate-on="submit lazy" @submit.prevent="login()">
        <v-text-field v-model="form.username" :rules="[usernameRule]" label="用户名" />
        <v-text-field v-model="form.password" :rules="[passwordRule]" type="password" label="密码" />
        <v-checkbox v-model="form.remember" label="在此设备上记住我" />
        <v-btn color="primary" :loading="isDoLogin" type="submit" block class="mt-2" text="登录" />
      </v-form>
    </v-card-item>
  </v-card>
</template>

<style scoped>
</style>
