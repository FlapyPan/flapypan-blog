export default eventHandler(() => {
  return ArticleSchema
    .find({ pinned: true })
    .sort({ updatedAt: 1 })
    .select({ _id: 1, title: 1, path: 1 })
})
