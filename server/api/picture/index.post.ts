import { addPicture } from '~/server/data/picture'

export default eventHandler(async (event) => {
  const file = ensure((await readMultipartFormData(event))?.[0], '请上传文件')
  ensure(file.type?.startsWith('/image'), '请上传图片文件')
  return addPicture(file)
})
