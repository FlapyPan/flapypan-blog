import { randomUUID } from 'node:crypto'
import type { Buffer } from 'node:buffer'
import type { MultiPartData } from 'h3'
import prisma from '~/server/data/prisma'

export async function addPicture({ data, filename }: MultiPartData): Promise<string> {
  const name = filename ?? randomUUID()
  const { id } = await prisma.picture.create({ data: { name, bytes: data }, select: { id: true, bytes: false } })
  return id
}

export async function getPicture(id: string): Promise<Buffer | null> {
  const picture = await prisma.picture.findFirst({ select: { bytes: true }, where: { id } })
  if (!picture) return null
  return picture.bytes
}
