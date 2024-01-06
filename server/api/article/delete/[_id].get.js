export default eventHandler(async (event) => {
  // DELETE /api/article/[_id] 方法报 404 的临时解决方案
  const _id = event.context.params?._id
  if (!_id) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  return ArticleSchema.deleteOne({ _id })
})
