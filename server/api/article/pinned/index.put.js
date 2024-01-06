import z from 'zod'

export default eventHandler(async (event) => {
  const result = z.object({
    _id: z.string().min(1),
    pinned: z.boolean(),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.errors[0].message })
  }
  const { _id, pinned } = result.data
  return ArticleSchema.updateOne({ _id }, { $set: { pinned } })
})
