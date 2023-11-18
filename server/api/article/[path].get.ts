import { getArticleByPath } from '~/server/data/article'

export default eventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  const article = await getArticleByPath(path)
  if (!article) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  return article
})
