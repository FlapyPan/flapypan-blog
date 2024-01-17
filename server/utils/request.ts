import type { ZodRawShape } from 'zod/lib/types'
import type { EventHandlerRequest, H3Event } from 'h3'
import z from 'zod'
import { useLogger } from '@nuxt/kit'

const logger = useLogger('utils-request')

const IP_HEADERS = [
  'X-Forwarded-For',
  'Proxy-Client-IP',
  'WL-Proxy-Client-IP',
  'HTTP_CLIENT_IP',
  'HTTP_X_FORWARDED_FOR',
]

export function getRealIP(event: H3Event) {
  for (const header of IP_HEADERS) {
    const ip = getHeader(event, header)
    if (ip) return ip
  }
  return getRequestIP(event)
}

function parse<T extends ZodRawShape>(data: unknown, shape: T) {
  const result = z.object(shape).safeParse(data)
  if (!result.success) {
    logger.warn(`表单校验错误`, result.error)
    throw createError({ statusCode: 400, message: result.error.errors[0].message })
  }
  return result.data
}

export async function readSafeBody<T extends ZodRawShape>(event: H3Event<EventHandlerRequest>, shape: T) {
  const data = await readBody(event)
  return parse(data, shape)
}

export function readParams<T extends ZodRawShape>(event: H3Event<EventHandlerRequest>, shape: T) {
  const data = event.context.params
  return parse(data, shape)
}
