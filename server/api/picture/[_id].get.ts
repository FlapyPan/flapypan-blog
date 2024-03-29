import z from 'zod'
import { getPicture } from '~/server/data/picture'

export default cachedEventHandler(
  async (event) => {
    const { _id } = readParams(event, { _id: z.string() })
    return ensure(await getPicture(_id), '不存在的图片', 404)
  },
  { maxAge: 31536000, headersOnly: true },
)
