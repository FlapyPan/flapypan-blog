export default eventHandler(async (event) => {
  const key = event.context.params?.key
  if (!key) {
    throw createError({ statusCode: 404, message: '不存在的key' })
  }
  const body = await readBody(event)
  if ((await AttributeSchema.count({ key })) > 0) {
    await AttributeSchema.findOneAndUpdate({ key }, { $set: { value: body } })
  } else {
    const attr = new AttributeSchema()
    attr.key = key
    attr.value = body
    await attr.save()
  }
  return AttributeSchema.findOne({ key })?.value
})
