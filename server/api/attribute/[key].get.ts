import { getAttr } from '~/server/data/attribute'

export default eventHandler(async (event) => {
  const key = event.context.params?.key
  if (!key) {
    throw createError({ statusCode: 404, message: '不存在的key' })
  }
  const attr = await getAttr(key)
  return attr?.value
})
