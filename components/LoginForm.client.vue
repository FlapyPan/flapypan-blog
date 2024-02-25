<script setup>
import { useAuthStore } from '~/store';
import { useToast } from 'vue-toastification';

const emits = defineEmits(['close']);

const auth = useAuthStore();
const toast = useToast();

/// region 登录
const form = reactive({
  username: '',
  password: '',
  remember: false,
});
const isDoLogin = shallowRef(false);

async function login() {
  isDoLogin.value = true;
  try {
    await auth.login(form);
    emits('close');
  } catch (e) {
    toast.error(e.message || '登录失败');
  } finally {
    isDoLogin.value = false;
  }
}

/// endregion 登录
</script>

<template>
  <form :disabled="isDoLogin" class="flex flex-col gap-6" @submit.prevent.stop>
    <p class="ml-2 text-xl">登录</p>
    <input
      v-model="form.username"
      :disabled="isDoLogin"
      name="username"
      placeholder="用户名"
      required
      type="text" />
    <input
      v-model="form.password"
      :disabled="isDoLogin"
      name="password"
      placeholder="密码"
      required
      type="password"
      @keydown.enter="login" />
    <p class="flex items-center gap-2 pr-2">
      <span class="flex-1"></span>
      <input
        id="login-remember"
        v-model="form.remember"
        :disabled="isDoLogin"
        name="remember"
        type="checkbox" />
      <label for="login-remember">记住我</label>
    </p>
    <Btn :disabled="isDoLogin" type="submit" @click="login"> 登录 </Btn>
  </form>
</template>
