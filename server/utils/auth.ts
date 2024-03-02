import process from 'node:process'
import type { H3Event } from 'h3'
import z from 'zod'
import { randomStr } from '@antfu/utils'

interface SessionUser {
  username: string
  scope: string[]
  expires: number
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const COOKIE_KEY = 'flapypan-blog'
const LoginSession: Record<string, SessionUser> = {}

/**
 * 登录获取token
 */
export async function login(event: H3Event): Promise<[string, SessionUser]> {
  const result = z.object({
    username: z.literal(ensure(ADMIN_USERNAME, '用户名或密码未设置', 500)),
    password: z.literal(ensure(ADMIN_PASSWORD, '用户名或密码未设置', 500)),
    remember: z.boolean().nullish(),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 401, message: '错误的用户名或密码' })
  }
  const token = randomStr(6)
  const expires = result.data.remember ? Date.now() + 604800000 : Date.now() + 3600000
  const user: SessionUser = {
    username: result.data.username,
    scope: ['user', 'admin'],
    expires,
  }
  LoginSession[token] = user
  setCookie(event, COOKIE_KEY, token, {
    httpOnly: true,
    sameSite: true,
    expires: result.data.remember ? new Date(expires) : undefined,
  })
  return [token, user]
}

/**
 * 退出登录
 * @param {H3Event} event
 */
export function logout(event: H3Event): unknown {
  const token = getCookie(event, COOKIE_KEY)
  if (!token) return {}
  delete LoginSession[token]
  setCookie(event, COOKIE_KEY, '', { maxAge: 0 })
  return {}
}

/**
 * 获取登录信息
 */
export function auth(event: H3Event): [string, SessionUser] {
  const token = getCookie(event, COOKIE_KEY)
  if (!token) {
    throw createError({ statusCode: 401, message: '未登录' })
  }
  const user = LoginSession[token]
  if (!user) {
    throw createError({ statusCode: 401, message: '登录已过期' })
  }
  if (user.expires < Date.now()) {
    delete LoginSession[token]
    setCookie(event, COOKIE_KEY, '', { maxAge: 0 })
    throw createError({ statusCode: 401, message: '登录已过期' })
  }
  return [token, user]
}
