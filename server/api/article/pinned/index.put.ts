import z from 'zod'
import { modifyArticlePinned } from '~/server/data/article'

export default eventHandler(async (event) => {
  const data = await readSafeBody(event, {
    _id: z.string().min(1),
    pinned: z.boolean(),
  })
  return modifyArticlePinned(data._id, data.pinned)
})
