export default eventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  const article = await ArticleSchema.findOne({ path })
  if (!article) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  const articleId = article._id

  // 获取与指定文章相关的访问次数
  const accessCountPromise = AccessSchema
    .count({ articleId })
  // 获取前一篇文章的路径
  const prePathPromise = ArticleSchema
    .findOne({ _id: { $lt: articleId } })
    .sort({ _id: -1 })
    .then((lastArticle) => lastArticle?.path)
  // 获取后一篇文章的路径
  const nextPathPromise = ArticleSchema
    .findOne({ _id: { $gt: articleId } })
    .sort({ _id: 1 })
    .then((nextArticle) => nextArticle?.path)
  // 记录一次访问
  const accessPromise = new AccessSchema({
    articleId,
    ip: getRealIP(event),
    referrer: getHeader(event, 'Referer'),
    ua: getHeader(event, 'User-Agent'),
  }).save()

  const [accessCount, pre, next] = await Promise
    .allSettled([accessCountPromise, prePathPromise, nextPathPromise, accessPromise])
    .then((results) => results
      .map(({ status, value }) => status === 'fulfilled' ? value : null))

  return { article, accessCount, pre, next }
})
