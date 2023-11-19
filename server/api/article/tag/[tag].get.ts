import { getArticleListByTag } from '~/server/data/article'

export default eventHandler(async (event) => {
  const tag = event.context.params?.tag
  if (!tag) {
    throw createError({ statusCode: 404, message: '不存在的标签' })
  }
  return getArticleListByTag(tag)
})
