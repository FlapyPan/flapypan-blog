// 检查登录状态
export default eventHandler(async (event) => {
  return auth(event)
})
