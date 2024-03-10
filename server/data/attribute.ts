export async function getAttr<T = unknown>(key: string) {
  const pair = await AttributeSchema.findOne({ key })
  return pair?.value as T
}

export async function setAttr<T = unknown>(key: string, value: T) {
  if ((await AttributeSchema.countDocuments({ key })) > 0) {
    await AttributeSchema.findOneAndUpdate({ key }, { $set: { value } })
  } else {
    await new AttributeSchema({ key, value }).save()
  }
  return getAttr(key)
}
