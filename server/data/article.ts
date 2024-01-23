import type { ObjectId } from 'bson'

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
    // 按照创建时间倒叙
    { $sort: { createdAt: -1 } },
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

export function getArticleListByTag(tag: string) {
  return ArticleSchema.find({ tags: tag }).sort({ createdAt: -1 })
}

export function getPinnedArticleList() {
  return ArticleSchema.find({ pinned: true }).sort({ updatedAt: 1 }).select({ _id: 1, title: 1, path: 1 })
}

export async function getPreArticlePath(_id: string | ObjectId) {
  const article = await ArticleSchema.findOne({ _id: { $lt: _id } }).sort({ _id: -1 })
  return article?.path
}

export async function getNextArticlePath(_id: string | ObjectId) {
  const article = await ArticleSchema.findOne({ _id: { $gt: _id } }).sort({ _id: 1 })
  return article?.path
}

interface ArticleAddRequest {
  title: string
  path: string
  cover?: string | null
  content: string
  tags: string[]
}

export async function addArticle(article: ArticleAddRequest) {
  const saved = await new ArticleSchema({ ...article, updatedAt: new Date() }).save()
  return { path: saved.path }
}

interface ArticleModifyRequest {
  _id: string | ObjectId
  title?: string | null
  path?: string | null
  cover?: string | null
  content?: string | null
  tags?: string[] | null
}

export async function modifyArticle(article: ArticleModifyRequest) {
  const newData: any = { ...article }
  if (newData.content) newData.updatedAt = new Date()
  await ArticleSchema.findByIdAndUpdate(article._id, newData)
  return { path: article.path }
}

export async function deleteArticle(_id: string | ObjectId) {
  await ArticleSchema.deleteOne({ _id })
}
