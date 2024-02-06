import { deleteArticle } from '~/server/data/article';
import z from 'zod';

export default eventHandler(async (event) => {
  // DELETE /api/article/[_id] 方法报 404 的临时解决方案
  const { _id } = readParams(event, { _id: z.string() });
  return deleteArticle(_id);
});
