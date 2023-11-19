const listSelect = {
  content: 0,
}

export function getRecentArticleList() {
  return ArticleSchema.find({}).limit(8).sort({ updatedAt: -1 }).select(listSelect)
}

export function getArticleList() {
  return ArticleSchema.find({}).sort({ createdAt: -1 }).select(listSelect)
}

export function getArticleYearly() {
  return ArticleSchema.aggregate([
    // 按照年份分组
    { $group: { _id: { $year: '$createdAt' }, list: { $push: '$$ROOT' } } },
    // 根据年份从大到小排列
    { $sort: { _id: -1 } },
    // 重命名结果，筛选字段
    {
      $project: {
        _id: 0,
        year: '$_id',
        list: { _id: 1, title: 1, path: 1, cover: 1, tags: 1, createdAt: 1, updatedAt: 1 },
      },
    },
  ])
}

export function getAllTags() {
  return ArticleSchema.distinct('tags')
}

export function getArticleByPath(path: string) {
  return ArticleSchema.findOne({ path })
}

interface ArticleAddRequest {
  title: string
  path: string
  cover?: string | null
  content: string
  tags: string[]
}

export async function addArticle(article: ArticleAddRequest) {
  const saved = await new ArticleSchema(article).save()
  return { path: saved.path }
}

interface ArticleModifyRequest {
  _id: string
  title: string
  path: string
  cover?: string | null
  content: string
  tags: string[]
}

export async function modifyArticle(article: ArticleModifyRequest) {
  const saved = await ArticleSchema.findByIdAndUpdate(article._id, article)
  return { path: saved?.path }
}

export function deleteArticle(id: string) {
  return ArticleSchema.deleteOne({ id })
}
