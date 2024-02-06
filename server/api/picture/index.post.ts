import { addPicture } from '~/server/data/picture';

export default eventHandler(async (event) => {
  const multiPartData = ensure(await readMultipartFormData(event), '错误的请求类型');
  const file = ensure(multiPartData[0], '请上传文件');
  ensure(file.type?.startsWith('image/'), '请上传图片文件');
  return addPicture(file);
});
