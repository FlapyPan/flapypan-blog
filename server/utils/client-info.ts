import type { H3Event } from 'h3'

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
