import z from 'zod';
import { getArticleById, modifyArticle } from '~/server/data/article';
import { sparkAI } from '~/server/utils/ai';

export default eventHandler(async (event) => {
  const { _id } = await readSafeBody(event, { _id: z.string() });
  const { content } = ensure(await getArticleById(_id), '不存在的文章', 404);
  const summary = await sparkAI.summary(content);
  await modifyArticle({ _id, summary });
  return {};
});
