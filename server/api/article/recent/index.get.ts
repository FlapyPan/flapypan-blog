import { getRecentArticleList } from '~/server/data/article'

export default cachedEventHandler(async () => getRecentArticleList())
