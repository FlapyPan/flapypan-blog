import process from 'node:process'
import type { BinaryLike } from 'node:crypto'
import { createHmac } from 'node:crypto'
import type { ErrorEvent } from 'ws'
import WebSocket from 'ws'

export interface SparkAIConversation {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface SparkAIResult {
  header: {
    code: number
    message: string
    status: 0 | 1 | 2
  }
  payload: {
    choices: {
      seq: number
      text: [{ content: string }]
    }
  }
}

function sha256Digest(secret: BinaryLike): (signOrigin: BinaryLike) => string {
  const hmac = createHmac('sha256', secret)
  return (signOrigin: BinaryLike) => {
    hmac.update(signOrigin)
    return hmac.digest('base64')
  }
}

async function getWebsocketUrl({ apiKey, apiSecret }: { apiKey: string, apiSecret: string }): Promise<URL> {
  const url = new URL('wss://spark-api.xf-yun.com/v3.5/chat')
  const host = url.host
  const path = url.pathname
  const date = new Date().toUTCString()
  const signOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`
  const sign = sha256Digest(apiSecret)(signOrigin)
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${sign}"`
  const authorization = btoa(authorizationOrigin)
  url.searchParams.set('authorization', authorization)
  url.searchParams.set('date', date)
  url.searchParams.set('host', host)
  return url
}

function openWebsocket(url: URL): (data: string) => Promise<string> {
  return async (data: string): Promise<string> => {
    const ws = new WebSocket(url)
    ws.onopen = () => ws.send(data)
    let timeout: ReturnType<typeof setTimeout>
    return new Promise<string>((_resolve, _reject) => {
      const buffer: string[] = []
      const resolve = () => _resolve(buffer.join(''))
      const reject = (e: Error | ErrorEvent) => {
        if (buffer.length > 0) {
          resolve()
        } else {
          _reject(e)
        }
      }
      timeout = setTimeout(() => reject(Error('请求超时')), 60000)
      let lastSeq = -1
      ws.onmessage = ({ data }) => {
        const { header, payload: { choices } } = JSON.parse(data.toString()) as SparkAIResult
        if (header.code !== 0) {
          reject(Error(header.message))
          return
        }
        if (choices.seq > lastSeq && choices.text.length > 0) {
          lastSeq = choices.seq
          buffer.push(choices.text[0].content)
        }
        if (header.status === 2) {
          resolve()
        }
      }
      ws.onerror = reject
    }).finally(() => {
      clearTimeout(timeout)
    })
  }
}

async function sendConversation(text: Array<SparkAIConversation>): Promise<string> {
  const appId = ensure(process.env.SPARK_APP_ID, '未设置SPARK_APP_ID', 500)
  const url = await getWebsocketUrl({
    apiKey: ensure(process.env.SPARK_API_KEY, '未设置SPARK_API_KEY', 500),
    apiSecret: ensure(process.env.SPARK_API_SECRET, '未设置SPARK_API_SECRET', 500),
  })
  const sender = openWebsocket(url)
  const data = JSON.stringify({
    header: { app_id: appId },
    parameter: { chat: { domain: 'generalv3.5', max_tokens: 128 } },
    payload: { message: { text } },
  })
  return await sender(data)
}

export const sparkAI = {
  sendConversation,
  summary(text: string): Promise<string> {
    return sendConversation([
      {
        role: 'system',
        content: '简洁地概括文章的主要内容，突出强调作者的核心论点和结论，控制在80个字以内',
      },
      {
        role: 'user',
        content: text,
      },
    ])
  },
}
