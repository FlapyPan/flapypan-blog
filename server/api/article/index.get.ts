import { getArticleList } from '~/server/data/article';

export default eventHandler(async () => {
  return getArticleList();
});
