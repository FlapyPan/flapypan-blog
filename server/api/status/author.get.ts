import type { AuthorStatusData } from '~/server/utils/status'

export default eventHandler(async (event) => {
  // 启用 SSE
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'Content-Type', 'text/event-stream')
  setResponseStatus(event, 200)
  const hook = (data: AuthorStatusData) => {
    event.node.res.write(`id: ${data.active}\n`)
    event.node.res.write(`data: ${data.state}\n\n`)
  }
  // 第一次连接直接发送
  hook(statusDataHolder.get())
  // 注册事件
  statusHooks.hook('authorStatus:get', hook)
  // 保持连接打开
  event._handled = true
})
