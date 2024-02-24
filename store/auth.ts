import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const isLogin = shallowRef(false);
  const loginDialogVisible = shallowRef(false);

  const check = () => {
    api(`/auth/user`)
      .then(() => (isLogin.value = true))
      .catch(() => (isLogin.value = false));
  };

  const login = async ({
    username,
    password,
    remember,
  }: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    const { token } = await api(`/auth/login`, 'POST', { username, password });
    if (token && import.meta.browser) {
      if (remember) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      isLogin.value = true;
    } else {
      isLogin.value = false;
      throw createError({ statusCode: 401, message: '登录失败' });
    }
  };

  const logout = async () => {
    try {
      await api(`/auth/logout`, 'POST');
    } finally {
      isLogin.value = false;
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
    }
  };

  return {
    isLogin,
    loginDialogVisible,
    check,
    login,
    logout,
  };
});
