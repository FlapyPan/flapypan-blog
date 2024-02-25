// 检查登录状态
export default eventHandler((event) => {
  return auth(event)
})
