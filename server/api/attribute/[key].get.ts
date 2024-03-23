import z from 'zod'
import { getAttr } from '~/server/data/attribute'

export default eventHandler(async (event) => {
  const accept = getHeader(event, 'Accept')?.split(',')[0]
  if (accept) {
    setHeader(event, 'Content-Type', accept)
  }
  const { key } = readParams(event, { key: z.string() })
  return await getAttr(key)
})
