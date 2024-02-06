import { getRecentArticleList } from '~/server/data/article';

export default eventHandler(async () => getRecentArticleList());
