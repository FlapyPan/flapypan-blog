import type { ObjectId } from 'bson'

interface AccessAddRequest {
  ip?: string | null
  referrer?: string | null
  ua?: string | null
  articleId: string | ObjectId
}

export function addAccess(access: AccessAddRequest) {
  new AccessSchema(access).save()
}

export function getArticleAccessCount(articleId: string | ObjectId): Promise<number> {
  return AccessSchema.count({ articleId })
}

export function getTodayAccessCount(): Promise<number> {
  const begin = new Date()
  begin.setHours(0, 0, 0, 0)
  const end = new Date()
  return AccessSchema.count({ createdAt: { $gte: begin, $lte: end } })
}

export function getAllAccessCount(): Promise<number> {
  return AccessSchema.count()
}
