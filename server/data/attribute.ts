export function getAttr(key: string) {
  return AttributeSchema.findOne({ key })
}

export async function setAttr(key: string, value: any) {
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
