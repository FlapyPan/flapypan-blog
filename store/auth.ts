import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  const isLogin = shallowRef(false)
  const loginDialogVisible = shallowRef(false)

  async function check() {
    try {
      await api(`/auth/user`)
      isLogin.value = true
    } catch {
      isLogin.value = false
    }
  }

  const login = async (form: { username: string, password: string, remember: boolean }) => {
    try {
      await api(`/auth/login`, 'POST', form)
      isLogin.value = true
      useToast().success('登录成功')
    } catch (e) {
      isLogin.value = false
      throw e
    }
  }

  const logout = async () => {
    try {
      await api(`/auth/logout`, 'POST')
    } finally {
      isLogin.value = false
      useToast().info('退出登录')
    }
  }

  return {
    isLogin,
    loginDialogVisible,
    check,
    login,
    logout,
  }
})
