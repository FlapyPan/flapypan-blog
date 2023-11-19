import type { Prisma } from '.prisma/client'
import prisma from '~/server/data/prisma'

export async function hasKey(key: string): Promise<boolean> {
  const count = await prisma.attribute.count({ where: { key } })
  return count > 0
}

export async function getValue(key: string): Promise<Prisma.JsonValue | null> {
  const attr: any = await prisma.attribute.findFirst({ select: { value: true }, where: { key } })
  if (!attr) return null
  return attr.value
}

export async function setValue(key: string, value: Prisma.JsonValue): Promise<void> {
  if (await hasKey(key)) {
    await prisma.attribute.update({ where: { key }, data: { value } })
  } else {
    await prisma.attribute.create({ data: { key, value } })
  }
}

export async function deleteKey(key: string): Promise<void> {
  await prisma.attribute.delete({ where: { key } })
}
