import { deleteArticle } from '~/server/data/article'

export default eventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 404, message: '不存在的文章' })
  }
  return deleteArticle(id)
})
