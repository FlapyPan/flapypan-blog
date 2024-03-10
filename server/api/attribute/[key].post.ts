import z from 'zod'
import { setAttr } from '~/server/data/attribute'

export default eventHandler(async (event) => {
  const { key } = readParams(event, { key: z.string() })
  const body = (await readBody(event)) ?? null
  return await setAttr(key, body)
})
