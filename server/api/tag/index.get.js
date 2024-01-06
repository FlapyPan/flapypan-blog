export default eventHandler(() => {
  return ArticleSchema.distinct('tags')
})
