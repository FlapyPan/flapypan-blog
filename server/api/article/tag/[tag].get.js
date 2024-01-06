export default eventHandler(async (event) => {
  const tag = event.context.params?.tag
  if (!tag) {
    throw createError({ statusCode: 404, message: '不存在的标签' })
  }
  // 浏览器会将路径进行编码，这里进行解码
  const decodedTag = decodeURI(tag)
  return ArticleSchema.find({ tags: decodedTag }).sort({ createdAt: -1 })
})
