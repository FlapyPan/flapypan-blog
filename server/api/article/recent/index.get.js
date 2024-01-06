export default eventHandler(() => {
  return ArticleSchema
    .find({})
    .limit(8)
    .sort({ updatedAt: -1 })
    .select({ content: 0 })
})
