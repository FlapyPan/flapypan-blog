export default eventHandler((event) => {
  const method = getMethod(event)
  // 不认证 get 请求
  if (method !== 'GET') {
    event.context.user = auth(event)
  }
})
