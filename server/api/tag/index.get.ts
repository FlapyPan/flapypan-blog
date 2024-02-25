import { getAllTags } from '~/server/data/article'

export default cachedEventHandler(async () => getAllTags())
