export default eventHandler(() => {
  return ArticleSchema
    .find({})
    .sort({ createdAt: -1 })
    .select({ content: 0 })
})
