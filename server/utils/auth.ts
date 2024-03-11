import process from 'node:process'
import { randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'
import z from 'zod'
import { sign, verify } from 'jsonwebtoken'

interface SessionUser {
  username: string
  scope: string[]
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const AUTH_SECRET = process.env.AUTH_SECRET || randomUUID()
const COOKIE_KEY = 'flapypan-blog'

/**
 * 登录获取token
 */
export async function login(event: H3Event): Promise<SessionUser> {
  const result = z.object({
    username: z.literal(ensure(ADMIN_USERNAME, '用户名或密码未设置', 500)),
    password: z.literal(ensure(ADMIN_PASSWORD, '用户名或密码未设置', 500)),
    remember: z.boolean().nullish(),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 401, message: '错误的用户名或密码' })
  }
  const user: SessionUser = {
    username: result.data.username,
    scope: ['user', 'admin'],
  }
  const expiresIn = result.data.remember ? '30d' : '1d'
  const token = sign(user, AUTH_SECRET, { expiresIn })
  setCookie(event, COOKIE_KEY, token, {
    httpOnly: true,
    sameSite: true,
    expires: result.data.remember ? new Date(Date.now() + 2592000000) : undefined,
  })
  return user
}

/**
 * 退出登录
 * @param {H3Event} event
 */
export function logout(event: H3Event): unknown {
  setCookie(event, COOKIE_KEY, '', { maxAge: 0 })
  return {}
}

/**
 * 获取登录信息
 */
export function auth(event: H3Event): SessionUser {
  const token = getCookie(event, COOKIE_KEY)
  if (!token) {
    throw createError({ statusCode: 401, message: '未登录' })
  }
  try {
    return verify(token, AUTH_SECRET) as SessionUser
  } catch (e) {
    logout(event)
    throw createError({ statusCode: 401, message: '登录失效' })
  }
}
