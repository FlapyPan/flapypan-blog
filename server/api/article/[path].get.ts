import { getArticleByPath, getNextArticlePath, getPreArticlePath } from '~/server/data/article'
import { addAccess, getArticleAccessCount } from '~/server/data/access'

export default eventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  const article = await getArticleByPath(path)
  if (!article) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  addAccess({
    ip: getRequestIP(event),
    referrer: getHeader(event, 'Referer'),
    ua: getHeader(event, 'User-Agent'),
    articleId: article._id,
  })
  const [accessCount, pre, next] = await Promise.all([
    getArticleAccessCount(article._id),
    getPreArticlePath(article._id),
    getNextArticlePath(article._id),
  ])
  return { article, accessCount, pre, next }
})
