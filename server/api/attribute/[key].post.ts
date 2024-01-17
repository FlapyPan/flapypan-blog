import { setAttr } from '~/server/data/attribute'
import z from 'zod'

export default eventHandler(async (event) => {
  const { key } = readParams(event, { key: z.string() })
  const body = await readBody(event)
  const attr = await setAttr(key, body)
  return attr?.value
})
