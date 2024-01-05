import { setAttr } from '~/server/data/attribute'

export default eventHandler(async (event) => {
  const key = event.context.params?.key
  if (!key) {
    throw createError({ statusCode: 404, message: '不存在的key' })
  }
  const body = await readBody(event)
  const attr = await setAttr(key, body)
  return attr?.value
})
