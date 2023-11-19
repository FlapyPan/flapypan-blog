import { AttributeSchema } from '~/server/models/attribute.schema'

export async function hasKey(key: string): Promise<boolean> {
  const count = await AttributeSchema.count({ key })
  return count > 0
}

export async function getValue(key: string): Promise<any> {
  const attr = await AttributeSchema.findOne({ key }).select({ value: 1 })
  return attr?.value
}

export async function setValue(key: string, value: any): Promise<void> {
  await new AttributeSchema({ key, value }).save()
}

export async function deleteKey(key: string): Promise<void> {
  await AttributeSchema.deleteOne({ key })
}
