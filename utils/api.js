import { appendResponseHeader } from 'h3'

/** @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} HttpMethod http 请求方法 */

/**
 * @typedef {Object} ApiOptions
 * @property {string|URL} url  请求路径
 * @property {HttpMethod?} method 请求方法
 * @property {any?} payload 请求数据
 * @property {boolean?} jsonPayload payload 是否为 json
 * @property {H3Event?} event
 */

/**
 * 封装的 fetch api, 请求和响应全部使用 json
 * @param {ApiOptions} options
 * @return {Promise<*>}
 */
const api = async (options = {
  url: '',
  method: 'GET',
  payload: null,
  jsonPayload: true,
  event: null,
}) => {
  const { url, method, payload, jsonPayload, event } = options
  const headers = useRequestHeaders(['cookie'])
  if (jsonPayload) { headers['Content-Type'] = 'application/json' }
  const body = payload ? (jsonPayload ? JSON.stringify(payload) : payload) : (void 0)
  const { _data: { success, code, data }, headers: responseHeaders } = await $fetch.raw(url, {
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
  if (!success) {
    let e
    if (code === 401) e = Error(data ?? '请登录')
    else if (code === 400) e = Error(data ?? '请求格式错误')
    else if (code === 400) e = Error(data ?? '请求的资源不存在')
    else if (code === 500) e = Error('服务器内部错误')
    else e = Error(data ?? '请求错误')
    console.error(e.message, e)
    throw e
  }
  return data
}

export default api
