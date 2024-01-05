/**
 * @typedef {Object} AccessAddRequest
 * @property {string|ObjectId} articleId
 * @property {string} [ip]
 * @property {string} [referrer]
 * @property {string} [ua]
 */

/**
 * @param {AccessAddRequest} access
 */
export function addAccess(access) {
  new AccessSchema(access).save()
}

/**
 * @param {string|ObjectId} articleId
 * @return {Promise<number>}
 */
export function getArticleAccessCount(articleId) {
  return AccessSchema.count({ articleId })
}

/**
 * @return {Promise<number>}
 */
export function getTodayAccessCount() {
  const begin = new Date()
  begin.setHours(0, 0, 0, 0)
  const end = new Date()
  return AccessSchema.count({ createdAt: { $gte: begin, $lte: end } })
}

/**
 * @return {Promise<number>}
 */
export function getAllAccessCount() {
  return AccessSchema.count()
}
