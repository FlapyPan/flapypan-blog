/**
 *
 * @param {string|URL} url  请求路径
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} [method] 请求方法
 * @param {any} [payload] 请求数据
 * @param {boolean} [jsonPayload] payload 是否为 json
 * @return {Promise<*>}
 */
export default async function api(url, method = 'GET', payload = null, jsonPayload = true) {
  const headers = {};
  if (import.meta.browser) {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (jsonPayload) headers['Content-Type'] = 'application/json';
  const body = payload ? (jsonPayload ? JSON.stringify(payload) : payload) : undefined;
  try {
    return await $fetch(url, {
      baseURL: '/api',
      method,
      headers,
      mode: 'same-origin',
      credentials: 'same-origin',
      redirect: 'follow',
      body,
    });
  } catch (e) {
    const { data, message, status } = e;
    if (status === 401) {
      useAuth().state.value.isLogin = false;
    } else if (import.meta.browser) {
      import('vue-toastification').then(({ toast }) => {
        toast.error(data?.message || message);
      });
    }
    throw new Error(`${status} ${data?.message || message}`);
  }
}
