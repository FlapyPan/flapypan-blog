import { getArticleYearly } from '~/server/data/article'

export default eventHandler(async () => getArticleYearly())
