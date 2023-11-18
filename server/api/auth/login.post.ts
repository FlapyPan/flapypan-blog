// 登录
export default eventHandler(async (event) => {
  const token = await login(event)
  return { token }
})
