import { randomUUID } from 'node:crypto'
import type { MultiPartData } from 'h3'
import type { ObjectId } from 'bson'
import { PictureSchema } from '~/server/models/picture.schema'

export async function addPicture({ data, filename }: MultiPartData): Promise<ObjectId> {
  const name = filename ?? randomUUID()
  const { _id } = await new PictureSchema({ bytes: data, name }).save()
  return _id
}

export async function getPicture(_id: string) {
  const picture = await PictureSchema.findById(_id)
  return picture?.bytes
}
