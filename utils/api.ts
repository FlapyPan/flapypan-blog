import { useToast } from 'vue-toastification'
import { useAuthStore } from '~/store'

/**
 *
 * @param {string} url  请求路径
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} [method] 请求方法
 * @param {any} [payload] 请求数据
 * @param {boolean} [jsonPayload] payload 是否为 json
 * @return {Promise<*>}
 */
export default async function api<T = unknown>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  payload?: any,
  jsonPayload: boolean = true,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (import.meta.browser) {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    if (token) headers.Authorization = `Bearer ${token}`
  }
  if (jsonPayload) headers['Content-Type'] = 'application/json'
  try {
    return await $fetch<T>(url, {
      baseURL: '/api',
      method,
      headers,
      mode: 'same-origin',
      credentials: 'same-origin',
      redirect: 'follow',
      body: jsonPayload ? JSON.stringify(payload) : payload,
    })
  } catch (e) {
    const { data, message, status } = e as any
    if (status === 401) {
      const auth = useAuthStore()
      auth.isLogin = false
    } else if (import.meta.browser) {
      useToast().error(data?.message || message)
    }
    throw new Error(`${status} ${data?.message || message}`)
  }
}