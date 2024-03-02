import crypto from 'node:crypto'
import process from 'node:process'
import type { H3Event } from 'h3'
import { sign, verify } from 'jsonwebtoken'
import z from 'zod'

interface ContextUser {
  username: string
  scope: string[]
}

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomUUID()

const TOKEN_TYPE = 'Bearer'

/**
 * 登录获取token
 */
export async function login(event: H3Event): Promise<string> {
  const result = z.object({
    username: z.literal(ensure(ADMIN_USERNAME, '用户名或密码未设置', 500)),
    password: z.literal(ensure(ADMIN_PASSWORD, '用户名或密码未设置', 500)),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 401, message: '错误的用户名或密码' })
  }
  const { username } = result.data
  const payload: ContextUser = {
    username,
    scope: ['user', 'admin'],
  }
  return sign(payload, AUTH_SECRET, { expiresIn: '7d' })
}

/**
 * 获取登录信息
 */
export function auth(event: H3Event): ContextUser {
  const authHeaderValue = ensure(getRequestHeader(event, 'Authorization'), '无token', 401)
  const [, extractedToken] = authHeaderValue.split(`${TOKEN_TYPE} `)
  try {
    return verify(extractedToken, AUTH_SECRET) as ContextUser
  } catch (e) {
    console.error(e)
    throw createError({ statusCode: 401, message: 'token无效' })
  }
}

export function isLogin(event: H3Event): boolean {
  try {
    auth(event)
    return true
  } catch (_) {
    return false
  }
}
