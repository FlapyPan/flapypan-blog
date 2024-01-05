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

/**
 * @param {string} path
 */
export function getArticleByPath(path) {
  return ArticleSchema.findOne({ path })
}

/**
 * @param {string} tag
 */
export function getArticleListByTag(tag) {
  return ArticleSchema.find({ tags: tag }).sort({ createdAt: -1 })
}

export function getPinnedArticleList() {
  return ArticleSchema.find({ pinned: true }).sort({ updatedAt: 1 }).select({ _id: 1, title: 1, path: 1 })
}

/**
 * @param {string|ObjectId} _id
 */
export async function getPreArticlePath(_id) {
  const article = await ArticleSchema.findOne({ _id: { $lt: _id } }).sort({ _id: -1 })
  return article?.path
}

/**
 * @param {string|ObjectId} _id
 */
export async function getNextArticlePath(_id) {
  const article = await ArticleSchema.findOne({ _id: { $gt: _id } }).sort({ _id: 1 })
  return article?.path
}

/**
 * @typedef {Object} ArticleAddRequest
 * @property {string} title
 * @property {string} path
 * @property {string} [cover]
 * @property {string} content
 * @property {string[]} tags
 */

/**
 * @param {ArticleAddRequest} article
 * @return {Promise<{path}>}
 */
export async function addArticle(article) {
  const saved = await new ArticleSchema({ ...article, updatedAt: new Date() }).save()
  return { path: saved.path }
}


/**
 * @param {ArticleAddRequest} article
 * @return {Promise<{path}>}
 */
export async function modifyArticle(article) {
  await ArticleSchema.findByIdAndUpdate(article._id, { ...article, updatedAt: new Date() })
  return { path: article.path }
}

/**
 * @param {string|ObjectId} _id
 * @param {boolean} pinned
 * @return {Promise<{pinned: boolean}>}
 */
export async function modifyArticlePinned(_id, pinned) {
  await ArticleSchema.updateOne({ _id }, { $set: { pinned, updatedAt: new Date() } })
  return { pinned }
}

/**
 * @param {string|ObjectId} _id
 * @return {Promise<void>}
 */
export async function deleteArticle(_id) {
  await ArticleSchema.deleteOne({ _id })
}
