export default eventHandler(async (event) => {
  const _id = event.context.params?._id
  if (!_id) {
    throw createError({ statusCode: 404, message: '不存在的图片' })
  }
  const picture = await PictureSchema.findById(_id)
  const buffer = picture?.bytes
  if (!buffer) {
    throw createError({ statusCode: 404, message: '不存在的图片' })
  }
  return buffer
})
