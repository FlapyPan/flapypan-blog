import { addPicture } from '~/server/data/picture'

export default eventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  if (!files || !files.length) {
    throw createError({ statusCode: 400, message: '请上传文件' })
  }
  const [file] = files
  if (!file.type?.startsWith('image/')) {
    throw createError({ statusCode: 400, message: '请上传图片文件' })
  }
  return addPicture(file)
})
