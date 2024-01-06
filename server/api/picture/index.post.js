import { randomUUID } from 'node:crypto'

export default eventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  if (!files || !files.length) {
    throw createError({ statusCode: 400, message: '请上传文件' })
  }
  const [file] = files
  if (!file.type?.startsWith('image/')) {
    throw createError({ statusCode: 400, message: '请上传图片文件' })
  }
  const { _id } = await new PictureSchema({
    bytes: file.data,
    name: file.filename ?? randomUUID(),
  }).save()
  return _id
})
