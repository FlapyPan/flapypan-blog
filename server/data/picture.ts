import type { MultiPartData } from 'h3'
import type { ObjectId } from 'bson'
import { randomUUID } from 'node:crypto'
import sharp from 'sharp'

export async function addPicture({ data, filename }: MultiPartData): Promise<ObjectId> {
  const name = filename ?? randomUUID()
  const bytes = await sharp(data, { animated: true }).webp().toBuffer()
  const { _id } = await new PictureSchema({ bytes, name }).save()
  return _id
}

export async function getPicture(_id: string) {
  const picture = await PictureSchema.findById(_id)
  return picture?.bytes
}
