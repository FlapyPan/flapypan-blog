import z from 'zod'

export default eventHandler(async (event) => {
  const result = z.object({
    _id: z.string().min(1),
    title: z.string().min(2, '标题长度2-32').max(32, '标题长度2-32'),
    path: z.string()
      .min(2, '路径长度2-32').max(64, '路径长度2-32')
      .regex(/^[a-z0-9:@._-]+$/, '路径只允许小写字母,数字,冒号,@,英文点,下划线,分隔符'),
    cover: z.string().nullish(),
    content: z.string().min(1, '内容不能为空'),
    tags: z.string().array(),
    pinned: z.boolean().nullish(),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.errors[0].message })
  }
  const data = result.data
  const { path } = await ArticleSchema.findByIdAndUpdate(data._id, { ...data, updatedAt: new Date() })
  return { path }
})