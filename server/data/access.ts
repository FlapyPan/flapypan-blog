interface AccessAddRequest {
  ip?: string | null
  referrer?: string | null
  ua?: string | null
  articleId: string
}

export function addAccess(access: AccessAddRequest) {
  new AccessSchema(access).save()
}

export function getArticleAccessCount(articleId: string): Promise<number> {
  return AccessSchema.count({ articleId })
}

export function getTodayAccessCount(): Promise<number> {
  const begin = new Date()
  begin.setHours(0, 0, 0, 0)
  const end = new Date()
  return AccessSchema.count({ createdAt: { $gte: begin, $lte: end } })
}

export function getTotalAccessCount(): Promise<number> {
  return AccessSchema.count()
}
