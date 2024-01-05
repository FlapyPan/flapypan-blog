import { getPicture } from '~/server/data/picture'

export default eventHandler(async (event) => {
  const _id = event.context.params?._id
  if (!_id) {
    throw createError({ statusCode: 404, message: '不存在的图片' })
  }
  const buffer = await getPicture(_id)
  if (!buffer) {
    throw createError({ statusCode: 404, message: '不存在的图片' })
  }
  return buffer
})
