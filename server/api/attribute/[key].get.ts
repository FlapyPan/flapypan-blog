import z from 'zod'
import { getAttr } from '~/server/data/attribute'

export default cachedEventHandler(async (event) => {
  const { key } = readParams(event, { key: z.string() })
  const attr = await getAttr(key)
  return attr?.value
})
