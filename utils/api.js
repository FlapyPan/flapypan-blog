/** @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} HttpMethod http 请求方法 */

/**
 * @typedef {object} ApiOptions
 * @property {string|URL} url  请求路径
 * @property {HttpMethod?} method 请求方法
 * @property {any?} payload 请求数据
 * @property {boolean?} jsonPayload payload 是否为 json
 */

/**
 * 封装的 fetch api, 请求和响应全部使用 json
 * @param {ApiOptions} options
 * @return {Promise<*>}
 */
export default async function api(options = {
  url: '',
  method: 'GET',
  payload: null,
  jsonPayload: true,
}) {
  const { url, method, payload, jsonPayload } = options
  const headers = {}
  if (import.meta.browser) {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    if (token) headers.Authorization = `Bearer ${token}`
  }
  if (jsonPayload) headers['Content-Type'] = 'application/json'
  const body = payload ? (jsonPayload ? JSON.stringify(payload) : payload) : undefined
  try {
    return await $fetch(url, {
      baseURL: '/api',
      method,
      headers,
      mode: 'same-origin',
      credentials: 'same-origin',
      redirect: 'follow',
      body,
    })
  } catch (e) {
    const { data, message, status } = e
    if (status === 401) useAuth().state.value.isLogin = false
    throw new Error(`${status} ${data?.message || message}`)
  }
}
