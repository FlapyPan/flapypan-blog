import z from 'zod'
import { setAttr } from '~/server/data/attribute'

export default eventHandler(async (event) => {
  const { key } = readParams(event, { key: z.string() })
  const body = (await readBody(event)) ?? null
  const attr = await setAttr(key, body)
  return attr?.value
})
