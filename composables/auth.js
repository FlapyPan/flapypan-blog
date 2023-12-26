export function useAuth() {
  const state = useState('auth', () => ({
    isLogin: false,
    loginDialogVisible: false,
  }))

  const check = () => {
    api({ url: `/auth/user` })
      .then(() => state.value.isLogin = true)
      .catch(() => state.value.isLogin = false)
  }

  const login = async ({ username, password, remember }) => {
    const { token } = await api({
      url: `/auth/login`,
      method: 'POST',
      payload: { username, password },
    })
    if (token && import.meta.browser) {
      if (remember) localStorage.setItem('token', token)
      else sessionStorage.setItem('token', token)
      state.value.isLogin = true
    } else {
      state.value.isLogin = false
      throw createError({ statusCode: 401, message: '登录失败' })
    }
  }

  const logout = async () => {
    try {
      await api({ url: `/auth/logout`, method: 'POST' })
    } finally {
      state.value.isLogin = false
      sessionStorage.removeItem('token')
      localStorage.removeItem('token')
    }
  }

  return { state, check, login, logout }
}
