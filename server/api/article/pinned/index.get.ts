import { getPinnedArticleList } from '~/server/data/article'

export default eventHandler(async () => getPinnedArticleList())
