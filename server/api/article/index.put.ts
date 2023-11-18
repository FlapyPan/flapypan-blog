import z from 'zod'
import { modifyArticle } from '~/server/data/article'

export default eventHandler(async (event) => {
  const result = z.object({
    id: z.string().min(1),
    title: z.string().min(2, '标题长度2-32').max(32, '标题长度2-32'),
    path: z.string()
      .min(2, '路径长度2-32').max(64, '路径长度2-32')
      .regex(/^[a-z0-9:@._-]+$/, '路径只允许小写字母,数字,冒号,@,英文点,下划线,分隔符'),
    cover: z.string().nullish(),
    content: z.string(),
    tagNames: z.string().array().nullish(),
  }).safeParse(await readBody(event))
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.errors[0].message })
  }
  return modifyArticle(result.data)
})
