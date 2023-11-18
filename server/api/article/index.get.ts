import { getArticlePage } from '~/server/data/article'

export default eventHandler(async (event) => {
  const pageable = getPageable(event, { createdAt: 'desc' })
  return getArticlePage(pageable)
})
