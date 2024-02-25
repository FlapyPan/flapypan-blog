import { getArticleList } from '~/server/data/article'

export default cachedEventHandler(async () => {
  return getArticleList()
})
