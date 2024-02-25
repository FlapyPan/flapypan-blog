import { getAttr } from '~/server/data/attribute'
import z from 'zod'

export default cachedEventHandler(async (event) => {
  const { key } = readParams(event, { key: z.string() })
  const attr = await getAttr(key)
  return attr?.value
})
