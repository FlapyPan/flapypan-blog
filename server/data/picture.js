import { randomUUID } from 'node:crypto'
import { PictureSchema } from '~/server/models/picture.schema'

/**
 * @param {Object} params
 * @param {Buffer} params.data
 * @param {string} params.filename
 * @returns {Promise<ObjectId>} - The result of the function.
 */
export async function addPicture({ data, filename }) {
  const name = filename ?? randomUUID()
  const { _id } = await new PictureSchema({ bytes: data, name }).save()
  return _id
}

/**
 * @param {string} _id
 * @return {Promise<Buffer|undefined>}
 */
export async function getPicture(_id) {
  const picture = await PictureSchema.findById(_id)
  return picture?.bytes
}
