import { getPicture } from '~/server/data/picture'
import z from 'zod'

export default eventHandler(async (event) => {
  const { _id } = readParams(event, { _id: z.string() })
  return ensure(await getPicture(_id), '不存在的图片', 404)
})
