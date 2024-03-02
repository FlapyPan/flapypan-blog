import z from 'zod'
import { getArticleByPath } from '~/server/data/article'
import { addAccess, getArticleAccessCount } from '~/server/data/access'

export default cachedEventHandler(async (event) => {
  const { path } = readParams(event, { path: z.string() })
  const article = ensure(await getArticleByPath(path), '不存在的文章', 404)
  void addAccess({
    ip: getRealIP(event),
    referrer: getHeader(event, 'Referer'),
    ua: getHeader(event, 'User-Agent'),
    articleId: article._id,
  })
  const accessCount = await getArticleAccessCount(article._id)
  return { ...article.toObject(), accessCount }
})
