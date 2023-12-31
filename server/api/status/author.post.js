export default eventHandler(async (event) => {
  const body = await readBody(event)
  // 发送事件
  await statusHooks.callHook('authorStatus:set', {
    state: body ?? '',
    active: Date.now(),
  })
})
