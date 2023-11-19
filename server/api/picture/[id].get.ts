import { getPicture } from '~/server/data/picture'

export default eventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 404, message: '不存在的图片' })
  }
  const buffer = await getPicture(id)
  if (!buffer) {
    throw createError({ statusCode: 404, message: '不存在的图片' })
  }
  return buffer
})
