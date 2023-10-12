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

const isDoLogin = ref(false)
const loginError = ref(null)

async function login() {
  isDoLogin.value = true
  const event = useRequestEvent()
  const { error } = await useAsyncData(`login:${form.username}`, () => api({
    url: `/auth/login`,
    method: 'POST',
    payload: parseFormData(),
    jsonPayload: false,
    event,
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
  <form class="bg-blur rounded-xl p-6 flex flex-col gap-6" :disabled="isDoLogin" @submit.prevent.stop>
    <p class="text-xl ml-2">
      登录
    </p>
    <input v-model="form.username" type="text" name="username" placeholder="用户名" required :disabled="isDoLogin">
    <input
      v-model="form.password" type="password" name="password" placeholder="密码" required :disabled="isDoLogin"
      @keydown.enter="login">
    <p class="flex items-center justify-end gap-2 pr-2">
      <input id="login-remember" v-model="form.remember" type="checkbox" name="remember" :disabled="isDoLogin">
      <label for="login-remember">记住我</label>
    </p>
    <f-btn type="submit" :disabled="isDoLogin" @click="login">
      登录
    </f-btn>
    <error-alert :show="loginError" :text="loginError" />
  </form>
</template>

<style scoped>
</style>
