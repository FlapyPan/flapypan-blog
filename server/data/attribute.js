import { AttributeSchema } from '~/server/models/attribute.schema'

/**
 * @param {string} key
 * @return {*}
 */
export function getAttr(key) {
  return AttributeSchema.findOne({ key })
}

/**
 * @param {string} key
 * @param {*} value
 * @return {Promise<*>}
 */
export async function setAttr(key, value) {
  if ((await AttributeSchema.count({ key })) > 0) {
    await AttributeSchema.findOneAndUpdate({ key }, { $set: { value } })
  } else {
    const attr = new AttributeSchema()
    attr.key = key
    attr.value = value
    await attr.save()
  }
  return getAttr(key)
}
