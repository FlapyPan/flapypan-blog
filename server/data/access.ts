import prisma from '~/server/data/prisma'

interface AccessAddRequest {
  ip?: string | null
  referrer?: string | null
  ua?: string | null
  articleId: string
}

export function addAccess(access: AccessAddRequest) {
  prisma.access.create({ data: access })
}

export function getArticleAccessCount(articleId: string): Promise<number> {
  return prisma.access.count({ where: { articleId } })
}

export function getTodayAccessCount(): Promise<number> {
  const begin = new Date()
  begin.setHours(0, 0, 0, 0)
  const end = new Date()
  return prisma.access.count({ where: { createdAt: { gte: begin, lte: end } } })
}

export function getTotalAccessCount(): Promise<number> {
  return prisma.access.count()
}
