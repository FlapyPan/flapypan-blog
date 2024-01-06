export default eventHandler(async (event) => {
  const _id = event.context.params?._id
  if (!_id) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  ArticleSchema.deleteOne({ _id })
})
