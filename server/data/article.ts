import type { Pageable } from '~/server/utils/page'
import prisma from '~/server/data/prisma'

const pageSelect = {
  id: true,
  title: true,
  path: true,
  cover: true,
  content: false,
  tags: true,
  createdAt: true,
  updatedAt: true,
}

export function getArticlePage({ cursor, size, orderBy }: Pageable) {
  if (cursor) {
    return prisma.article.findMany({
      select: pageSelect,
      cursor: { id: cursor },
      take: size,
      orderBy,
    })
  }
  return prisma.article.findMany({ select: pageSelect, take: size })
}

export function getArticleByPath(path: string) {
  return prisma.article.findFirst({ where: { path } })
}

interface ArticleAddRequest {
  title: string
  path: string
  cover?: string | null
  content: string
  tags: string[]
}

export function addArticle(article: ArticleAddRequest) {
  return prisma.article.create({
    data: article,
    select: pageSelect,
  })
}

interface ArticleModifyRequest {
  id: string
  title: string
  path: string
  cover?: string | null
  content: string
  tags: string[]
}

export function modifyArticle(article: ArticleModifyRequest) {
  return prisma.article.update({
    where: { id: article.id },
    data: article,
    select: pageSelect,
  })
}

export function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } })
}
