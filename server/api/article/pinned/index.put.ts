import z from 'zod'
import { modifyArticlePinned } from '~/server/data/article'

export default eventHandler(async (event) => {
  const result = z.object({
    _id: z.string().min(1),
    pinned: z.boolean(),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.errors[0].message })
  }
  return modifyArticlePinned(result.data._id, result.data.pinned)
})
