import { deleteArticle } from '~/server/data/article';
import z from 'zod';

export default eventHandler(async (event) => {
  const { _id } = readParams(event, { _id: z.string() });
  return deleteArticle(_id);
});
