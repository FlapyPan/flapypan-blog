import { getPinnedArticleList } from '~/server/data/article';

export default cachedEventHandler(async () => getPinnedArticleList());
