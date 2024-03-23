import z from 'zod'
import { getArticleListByTag } from '~/server/data/article'

export default eventHandler(async (event) => {
  const { tag } = readParams(event, { tag: z.string() })
  // 浏览器会将路径进行编码，这里进行解码
  const decodedTag = decodeURI(tag)
  return getArticleListByTag(decodedTag)
})
