<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useAuthStore } from '~/store'

const emits = defineEmits<{ (e: 'close'): void }>()

const auth = useAuthStore()
const toast = useToast()

/// region 登录
const form = reactive({
  username: '',
  password: '',
  remember: false,
})
const isDoLogin = shallowRef(false)

async function login() {
  isDoLogin.value = true
  try {
    await auth.login(form)
    emits('close')
  } catch (e) {
    if (e instanceof Error) toast.error(e.message || '登录失败')
  } finally {
    isDoLogin.value = false
  }
}

/// endregion 登录
</script>

<template>
  <form :disabled="isDoLogin" class="flex flex-col gap-6" @submit.prevent.stop>
    <p class="ml-2 text-xl">
      登录
    </p>
    <TextField v-model="form.username" :disabled="isDoLogin" placeholder="用户名" />
    <TextField
      v-model="form.password" :disabled="isDoLogin" placeholder="密码" type="password"
      @keydown.enter="login"
    />
    <div class="flex justify-end">
      <TextField
        v-model="form.remember"
        :disabled="isDoLogin"
        label="记住我"
        type="checkbox"
      />
    </div>
    <Btn :disabled="isDoLogin" type="submit" @click="login">
      登录
    </Btn>
  </form>
</template>
