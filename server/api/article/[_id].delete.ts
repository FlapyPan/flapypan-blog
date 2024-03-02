import z from 'zod'
import { deleteArticle } from '~/server/data/article'

export default eventHandler(async (event) => {
  const { _id } = readParams(event, { _id: z.string() })
  return deleteArticle(_id)
})
