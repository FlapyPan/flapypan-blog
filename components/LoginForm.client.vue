<script setup>
const emits = defineEmits(['close'])

const auth = useAuth()

/// region 登录
const form = reactive({
  username: '',
  password: '',
  remember: false,
})
const isDoLogin = ref(false)
const loginError = ref(null)

async function login() {
  isDoLogin.value = true
  loginError.value = null
  try {
    await auth.login(form)
    emits('close')
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
