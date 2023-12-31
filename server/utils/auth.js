import crypto from 'node:crypto'
import { sign, verify } from 'jsonwebtoken'
import z from 'zod'

/**
 * @typedef {import('jsonwebtoken').JwtPayload} JwtPayload
 */

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
export const AUTH_SECRET = process.env.AUTH_SECRET || crypto.randomUUID()

const TOKEN_TYPE = 'Bearer'

/**
 * @param {string} authHeaderValue
 * @return {string}
 */
function extractToken(authHeaderValue) {
  const [, token] = authHeaderValue.split(`${TOKEN_TYPE} `)
  return token
}

/**
 * 登录获取token
 * @param {H3Event} event
 * @return {Promise<string>}
 */
export async function login(event) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw createError({ statusCode: 500, message: '用户名或密码未设置' })
  }
  const result = z.object({
    username: z.literal(ADMIN_USERNAME),
    password: z.literal(ADMIN_PASSWORD),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 401, message: '错误的用户名或密码' })
  }
  const { username } = result.data
  const payload = {
    username,
    scope: ['user', 'admin'],
  }
  return sign(payload, AUTH_SECRET, { expiresIn: '7d' })
}

/**
 * 获取登录信息
 * @param {H3Event} event
 * @return {JwtPayload|string}
 */
export function auth(event) {
  const authHeaderValue = getRequestHeader(event, 'Authorization')
  if (!authHeaderValue) {
    throw createError({ statusCode: 403, message: '无token' })
  }
  const extractedToken = extractToken(authHeaderValue)
  try {
    return verify(extractedToken, AUTH_SECRET)
  } catch (e) {
    console.error(e)
    throw createError({ statusCode: 403, statusMessage: 'token无效' })
  }
}
