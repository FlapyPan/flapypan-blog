/** @typedef {'GET' | 'POST' | 'PUT' | 'DELETE'} HttpMethod http 请求方法 */

/** 后端api地址 */
export const API_URL = '/api'

/**
 * 封装的 fetch api, 请求和响应全部使用 json
 * @param {string|URL} url  请求路径
 * @param {HttpMethod} method 请求方法
 * @param {*} payload 请求数据
 * @param {boolean} jsonPayload payload 是否为 json
 * @return {Promise<*>}
 */
export const api = async (url, method = 'GET', payload = (void 0), jsonPayload = true) => {
  const headers = jsonPayload ? {
    'Content-Type': 'application/json',
  } : {}
  const body = payload ? (jsonPayload ? JSON.stringify(payload) : payload) : (void 0)
  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    mode: 'same-origin',
    credentials: 'same-origin',
    redirect: 'follow',
    body,
  })
  if (!response?.ok) {
    throw Error(response.statusText)
  }
  const json = await response.json()
  if (!json?.success) {
    const {code} = json
    if (code === 401) throw Error(json?.data ?? '请登录')
    if (code === 400) throw Error(json?.data ?? '请求格式错误')
    if (code === 400) throw Error(json?.data ?? '请求的资源不存在')
    if (code === 500) throw Error('服务器内部错误')
    throw Error(json?.data ?? '请求错误')
  }
  return json.data
}
