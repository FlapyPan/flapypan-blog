import { appendResponseHeader } from 'h3'
import { useSettingStore } from '~/composables/states.js'

/** @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} HttpMethod http 请求方法 */

/**
 * @typedef {object} ApiOptions
 * @property {string|URL} url  请求路径
 * @property {HttpMethod?} method 请求方法
 * @property {any?} payload 请求数据
 * @property {boolean?} jsonPayload payload 是否为 json
 * @property {H3Event?} event 事件
 */

/**
 * 封装的 fetch api, 请求和响应全部使用 json
 * @param {ApiOptions} options
 * @return {Promise<*>}
 */
async function api(options = {
  url: '',
  method: 'GET',
  payload: null,
  jsonPayload: true,
  event: null,
}) {
  const { url, method, payload, jsonPayload, event } = options
  const headers = useRequestHeaders(['cookie'])
  if (jsonPayload) headers['Content-Type'] = 'application/json'
  const body = payload ? (jsonPayload ? JSON.stringify(payload) : payload) : undefined
  const { _data: data, headers: responseHeaders, status } = await $fetch.raw(url, {
    baseURL: '/api',
    method,
    headers,
    mode: 'same-origin',
    credentials: 'same-origin',
    redirect: 'follow',
    body,
  })
  if (event) {
    const cookies = (responseHeaders.get('set-cookie') || '').split(',')
    for (const cookie of cookies) {
      appendResponseHeader(event, 'set-cookie', cookie)
    }
  }
  if (status === 401) useSettingStore().value.isLogin = false

  return data
}

export default api
