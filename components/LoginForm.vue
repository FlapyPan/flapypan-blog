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
  loginError.value = null
  const event = useRequestEvent()
  try {
    const ok = await api({
      url: `/auth/login`,
      method: 'POST',
      payload: parseFormData(),
      jsonPayload: false,
      event,
    })
    if (ok) {
      settingStore.value.isLogin = true
      emits('close')
    } else {
      loginError.value = '登陆失败'
    }
  } catch (e) {
    loginError.value = e.message
  }
  isDoLogin.value = false
}

/// endregion 登录
</script>

<template>
  <form :disabled="isDoLogin" class="flex flex-col gap-6" @submit.prevent.stop>
    <p class="text-xl ml-2">
      登录
    </p>
    <input v-model="form.username" :disabled="isDoLogin" name="username" placeholder="用户名" required type="text">
    <input
      v-model="form.password" :disabled="isDoLogin" name="password" placeholder="密码" required type="password"
      @keydown.enter="login">
    <p class="flex items-center gap-2 pr-2">
      <span v-show="loginError" class="text-xs text-red-500">
        {{ loginError }}
      </span>
      <span class="flex-1"></span>
      <input id="login-remember" v-model="form.remember" :disabled="isDoLogin" name="remember" type="checkbox">
      <label for="login-remember">记住我</label>
    </p>
    <f-btn :disabled="isDoLogin" type="submit" @click="login">
      登录
    </f-btn>
  </form>
</template>

<style scoped>
</style>
